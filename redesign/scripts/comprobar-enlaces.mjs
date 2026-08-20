// Vuelve a comprobar cada «visto en» del catálogo.
//
// El problema que resuelve: una ficha que dice «esta técnica se usa en tal web»
// caduca sola. Los sitios se rediseñan, la técnica desaparece y la ficha sigue
// prometiendo una prueba que ya no está, que es peor que no prometer nada.
//
// Por eso cada pareja guarda su `prueba`: el marcador exacto que se buscó en el
// HTML y en las hojas de estilo del sitio (`scroll-snap-type`, `@container`,
// `animation-timeline`, `lenis`…). Este script hace lo mismo que se hizo a mano
// el día que se escribió: baja la portada, baja sus hojas de estilo del mismo
// origen y cuenta el marcador.
//
//   pnpm enlaces
//
// Sale con código 1 si algún sitio no responde o si su marcador ya no aparece.
// No es infalible: un sitio puede cargar su CSS por JavaScript y dar un falso
// negativo. Por eso el fallo se cuenta y se explica, en vez de borrar la ficha.
import { CONCEPTS } from '../src/data/concepts.js'
import { COMPONENT_ITEMS } from '../src/data/components.js'

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36'

const bajar = async (url) => {
  const ctrl = new AbortController()
  const reloj = setTimeout(() => ctrl.abort(), 25_000)
  try {
    const r = await fetch(url, { headers: { 'user-agent': UA }, signal: ctrl.signal, redirect: 'follow' })
    if (!r.ok) return { estado: r.status, texto: '' }
    return { estado: r.status, texto: await r.text() }
  } catch {
    return { estado: 0, texto: '' }
  } finally {
    clearTimeout(reloj)
  }
}

// El HTML más las primeras hojas de estilo que enlaza. Se cortan en seis: una
// portada moderna trae docenas de trozos y no hace falta bajarlos todos para
// saber si la técnica sigue viva.
const bajarSitio = async (url) => {
  const { estado, texto } = await bajar(url)
  if (!estado) return { estado, todo: '' }
  const base = new URL(url)
  const hojas = [...texto.matchAll(/href="([^"]+\.css[^"]*)"/g)].slice(0, 6).map((m) => m[1])
  const trozos = await Promise.all(
    hojas.map((h) => bajar(new URL(h, base).href).then((r) => r.texto)),
  )
  return { estado, todo: texto + trozos.join('') }
}

const conVistoEn = [
  ...CONCEPTS.flatMap((g) => g.items),
  ...COMPONENT_ITEMS,
].filter((i) => i.vistoEn)

if (conVistoEn.length === 0) {
  console.log('  no hay ningún «visto en» que comprobar')
  process.exit(0)
}

// Un sitio se baja UNA vez aunque lo citen cuatro fichas.
const sitios = [...new Set(conVistoEn.map((i) => i.vistoEn.url))]
const cache = new Map()
for (const url of sitios) cache.set(url, await bajarSitio(url))

let fallos = 0
for (const item of conVistoEn) {
  const { sitio, url, prueba, visto } = item.vistoEn
  const { estado, todo } = cache.get(url)
  const veces = estado ? todo.toLowerCase().split(prueba.toLowerCase()).length - 1 : 0
  const nombre = `${item.name} → ${sitio}`
  if (!estado) {
    console.log(`  ✗ ${nombre}: no responde`)
    fallos++
  } else if (veces === 0) {
    console.log(`  ✗ ${nombre}: ya no encuentro «${prueba}» (comprobado el ${visto})`)
    fallos++
  } else {
    console.log(`  ✓ ${nombre}: «${prueba}» ×${veces}`)
  }
}

console.log(
  fallos === 0
    ? `\n  ${conVistoEn.length} «visto en» siguen siendo verdad`
    : `\n  ${fallos} de ${conVistoEn.length} hay que revisarlos a mano: o el sitio cambió, o carga su CSS por JavaScript`,
)
process.exit(fallos === 0 ? 0 : 1)
