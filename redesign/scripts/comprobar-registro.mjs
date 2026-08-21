// Comprueba que el registro que sirve el MCP sea válido y, sobre todo, que no se
// escape ni una línea de código ajeno.
//
//   pnpm registro
//
// Son dos preguntas, y la segunda es la que de verdad importa:
//
//   1. ¿Está bien formado? Cada item del índice tiene nombre, tipo y título, y
//      itemRegistro() sabe devolverlo entero.
//   2. LA GUARDIA. Ningún componente puede traer código dentro. Los 12
//      componentes son de canvasui/arlan y la licencia MIT de este repo NO los
//      cubre (ver LICENSING.md): se sirven como metadata + comando de instalación
//      del origen, con files SIEMPRE vacío. Las skills, al revés, son CC BY de la
//      casa y SÍ tienen que traer su body. Si un componente trae un archivo de
//      código, o una skill viene sin cuerpo, esto se pone rojo y para el commit.
//
// Además valida los registries externos que se federan: que respondan y devuelvan
// un registry JSON con items de verdad (un 200 con una SPA dentro no vale). Mientras
// un registry esté sin verificar (verificado: false), su caída se avisa pero no
// tumba el script. Un registry ya verificado que se cae, o que deja de devolver
// items, sí cuenta como error.
import { promises as dns } from 'node:dns'
import { indiceRegistro, itemRegistro } from '../src/lib/registro.js'
import { REGISTRIES } from '../src/data/registries.js'

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36'

let errores = 0

// 1. Estructura + 2. la guardia anti-fuga.
const indice = indiceRegistro()
for (const it of indice.items) {
  if (!it.name || !it.type || !it.title) {
    console.log(`  ✗ item incompleto en el índice: ${JSON.stringify(it)}`)
    errores++
    continue
  }
  const full = itemRegistro(it.name)
  if (!full) {
    console.log(`  ✗ ${it.name}: el índice lo lista pero itemRegistro() no lo encuentra`)
    errores++
    continue
  }
  if (full.type === 'registry:component') {
    if (Array.isArray(full.files) && full.files.length > 0) {
      console.log(`  ✗ FUGA DE LICENCIA: el componente ${it.name} trae ${full.files.length} archivo(s) de código ajeno`)
      errores++
    }
  } else if (!full.files?.[0]?.content) {
    console.log(`  ✗ la skill ${it.name} no trae su body (debería, es CC BY de la casa)`)
    errores++
  }
}

const comps = indice.items.filter((i) => i.type === 'registry:component').length
const skills = indice.items.filter((i) => i.type === 'registry:file').length
console.log(`  ${indice.items.length} items: ${comps} componentes (sin código), ${skills} skills (con body)`)

// 3. ¿Siguen vivos los registries externos? Igual que pnpm catalogo: el DNS no lo
// puede fingir un cortafuegos; un 401/403/429 es la web bloqueando robots, no un
// enlace roto.
async function revisar(url) {
  let host
  try {
    host = new URL(url).hostname
  } catch {
    return { estado: 'muerto', por: 'la dirección no es válida' }
  }
  try {
    await dns.lookup(host)
  } catch (e) {
    if (e.code === 'ENOTFOUND') return { estado: 'muerto', por: 'el dominio no existe' }
    return { estado: 'dudoso', por: `el DNS falló (${e.code})` }
  }
  const ctrl = new AbortController()
  const reloj = setTimeout(() => ctrl.abort(), 20_000)
  try {
    const r = await fetch(url, { headers: { 'user-agent': UA, accept: 'application/json,*/*' }, signal: ctrl.signal, redirect: 'follow' })
    if (r.status === 404 || r.status === 410) return { estado: 'muerto', por: `devuelve ${r.status}` }
    if ([401, 403, 429].includes(r.status)) return { estado: 'bloqueado', por: `bloquea robots (${r.status})` }
    if (r.status >= 500) return { estado: 'dudoso', por: `el servidor devuelve ${r.status}` }
    // Un 200 no basta: media web devuelve su SPA con 200. Vale si es un registry
    // JSON con items de verdad, en cualquiera de sus dos formas.
    let txt
    try {
      txt = await r.text()
    } catch {
      return { estado: 'dudoso', por: 'no se pudo leer el cuerpo' }
    }
    let items = null
    try {
      const j = JSON.parse(txt)
      items = Array.isArray(j.items) ? j.items.length : Array.isArray(j) ? j.length : null
    } catch {
      return { estado: 'no-registry', por: `responde ${r.status} pero no es JSON` }
    }
    if (items === null) return { estado: 'no-registry', por: 'es JSON pero no trae items' }
    return { estado: 'vivo', por: `${items} items` }
  } catch (e) {
    return { estado: 'dudoso', por: e.name === 'AbortError' ? 'no contestó en 20s' : 'la conexión se cortó' }
  } finally {
    clearTimeout(reloj)
  }
}

const vistos = await Promise.all(REGISTRIES.map((reg) => revisar(reg.indexUrl)))
REGISTRIES.forEach((reg, i) => {
  const { estado, por } = vistos[i]
  const roto = estado === 'muerto' || estado === 'no-registry'
  const marca = estado === 'vivo' ? '✓' : roto ? '✗' : '?'
  const nota = reg.verificado ? '' : ' (sin verificar)'
  console.log(`  ${marca} ${reg.name}${nota}: ${estado} · ${por}\n      ${reg.indexUrl}`)
  if (roto && reg.verificado) errores++
})

if (errores === 0) console.log('\n  registro válido y sin fugas de código ajeno')
else console.log(`\n  ${errores} problema(s) que arreglar antes de servir el registro`)
process.exit(errores ? 1 : 0)
