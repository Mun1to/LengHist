// Comprueba que todo lo que el catálogo enlaza siga existiendo.
//
// El día que se escribió, el catálogo llevaba 78 recursos y ninguno se había
// vuelto a mirar desde que se añadió. Uno de ellos, Dora, apuntaba a
// `dora.run`, un dominio que había dejado de existir: no es que la web
// estuviera caída, es que el dominio estaba libre y cualquiera podía comprarlo
// y poner ahí lo que quisiera, con Vibeset enlazándolo desde su catálogo.
//
//   pnpm catalogo
//
// Es el hermano de `pnpm enlaces`: aquel comprueba que la TÉCNICA siga usándose
// en el sitio que la ficha promete; este, más sencillo y más ancho, comprueba
// que el sitio siga estando ahí.
//
// La parte difícil no es pedir la página, es no criar lobos. Media web seria
// bloquea a los programas que no son un navegador, así que un comprobador que
// trate el 403 de Cloudflare como un enlace roto se pone rojo cada vez que se
// lanza, y a la tercera nadie lo lanza. Por eso el veredicto sale de dos
// preguntas separadas:
//
//   1. ¿Resuelve el DNS? Esto no lo puede fingir ningún cortafuegos. Si el
//      dominio no existe, el enlace está muerto y no hay más que hablar.
//   2. ¿Qué contesta el servidor? Un 404 o un 410 es la web diciendo que esa
//      página ya no está. Un 401, un 403 o un 429 es la web diciendo que no le
//      gustan los robots, que es otra cosa y no es problema nuestro.
//
// Sale con código 1 solo si hay enlaces MUERTOS. Los bloqueados y los que
// fallan por un rato malo se cuentan aparte y se enseñan, porque conviene
// saber cuáles no se han podido comprobar de verdad.
import { promises as dns } from 'node:dns'
import { RESOURCES } from '../src/data/resources.js'
import { COMPONENT_ITEMS } from '../src/data/components.js'
import { CONCEPTS } from '../src/data/concepts.js'
import { SKILL_ITEMS } from '../src/data/skills.js'

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36'

// Cuántas peticiones a la vez. Con 77 enlaces, de una en una son minutos.
const A_LA_VEZ = 8

const enlaces = [
  ...RESOURCES.flatMap((g) => g.items.map((i) => ({ zona: 'recursos', nombre: i.name, url: i.url }))),
  ...COMPONENT_ITEMS.map((i) => ({ zona: 'componentes', nombre: i.name, url: i.url })),
  ...CONCEPTS.flatMap((g) => g.items)
    .filter((i) => i.vistoEn)
    .map((i) => ({ zona: 'visto en', nombre: i.name, url: i.vistoEn.url })),
  ...SKILL_ITEMS.filter((i) => i.repo).map((i) => ({ zona: 'skills', nombre: i.name, url: i.repo })),
].filter((e) => e.url)

const MUERTO = 'muerto'
const VIVO = 'vivo'
const BLOQUEADO = 'bloqueado'
const DUDOSO = 'dudoso'

async function revisar({ url }) {
  let host
  try {
    host = new URL(url).hostname
  } catch {
    return { estado: MUERTO, por: 'la dirección no es válida' }
  }

  // Primero el DNS, que es lo único que no depende de que al servidor le
  // caigamos bien. Un dominio que no resuelve en ningún sitio está muerto.
  try {
    await dns.lookup(host)
  } catch (e) {
    if (e.code === 'ENOTFOUND') return { estado: MUERTO, por: 'el dominio ya no existe' }
    return { estado: DUDOSO, por: `el DNS falló (${e.code})` }
  }

  const ctrl = new AbortController()
  const reloj = setTimeout(() => ctrl.abort(), 20_000)
  try {
    const r = await fetch(url, {
      headers: { 'user-agent': UA, accept: 'text/html,*/*' },
      signal: ctrl.signal,
      redirect: 'follow',
    })
    if (r.status === 404 || r.status === 410) return { estado: MUERTO, por: `la página devuelve ${r.status}` }
    if ([401, 403, 429].includes(r.status)) return { estado: BLOQUEADO, por: `bloquea robots (${r.status})` }
    if (r.status >= 500) return { estado: DUDOSO, por: `el servidor devuelve ${r.status}` }
    return { estado: VIVO, por: String(r.status) }
  } catch (e) {
    // Aquí caen los cortes de red y los servidores que cuelgan la llamada al
    // ver un user-agent que no les gusta. El dominio existe, así que no se
    // puede afirmar que el enlace esté roto.
    return { estado: DUDOSO, por: e.name === 'AbortError' ? 'no contestó en 20s' : 'la conexión se cortó' }
  } finally {
    clearTimeout(reloj)
  }
}

// En tandas, para no abrir setenta y siete conexiones de golpe.
const resultados = []
for (let i = 0; i < enlaces.length; i += A_LA_VEZ) {
  const tanda = enlaces.slice(i, i + A_LA_VEZ)
  const vistos = await Promise.all(tanda.map(revisar))
  tanda.forEach((e, j) => resultados.push({ ...e, ...vistos[j] }))
  process.stdout.write(`\r  comprobando ${Math.min(i + A_LA_VEZ, enlaces.length)}/${enlaces.length}...`)
}
process.stdout.write('\r' + ' '.repeat(40) + '\r')

const muertos = resultados.filter((r) => r.estado === MUERTO)
const dudosos = resultados.filter((r) => r.estado === DUDOSO)
const bloqueados = resultados.filter((r) => r.estado === BLOQUEADO)
const vivos = resultados.filter((r) => r.estado === VIVO)

for (const r of muertos) console.log(`  ✗ ${r.zona} · ${r.nombre}: ${r.por}\n      ${r.url}`)
for (const r of dudosos) console.log(`  ? ${r.zona} · ${r.nombre}: ${r.por}\n      ${r.url}`)

console.log(
  `\n  ${vivos.length} vivos · ${bloqueados.length} bloquean robots (no se pueden comprobar desde aquí)` +
    `${dudosos.length ? ` · ${dudosos.length} sin respuesta clara, míralos a mano` : ''}` +
    `${muertos.length ? ` · ${muertos.length} MUERTOS` : ''}`,
)
if (muertos.length) console.log('  Un enlace muerto se quita del catálogo: el dominio libre lo compra cualquiera.')

process.exit(muertos.length ? 1 : 0)
