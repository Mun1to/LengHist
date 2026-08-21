// Prueba de humo del MCP sin tocar la red: ejercita el endpoint entero contra el
// catálogo propio y comprueba los invariantes que no pueden romperse.
//
//   pnpm mcp
//
// No federa (eso necesita internet y lo cubre `pnpm registro`): aquí se comprueba
// que el protocolo responde, que search filtra por el criterio de la casa, que
// get_item respeta la licencia (skill con body, componente sin código) y que los
// errores JSON-RPC salen bien.
import { onRequestPost } from '../functions/api/mcp.js'

let fallos = 0
const mal = (msg) => { console.log(`  ✗ ${msg}`); fallos++ }
const bien = (msg) => console.log(`  ✓ ${msg}`)

async function llamar(body) {
  const req = new Request('http://localhost/api/mcp', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  const r = await onRequestPost({ request: req })
  return { status: r.status, json: r.status === 202 ? null : JSON.parse(await r.text()) }
}

// 1. initialize
const init = await llamar({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18' } })
if (init.json?.result?.serverInfo?.name === 'vibeset') bien('initialize responde con serverInfo')
else mal('initialize no devuelve serverInfo')

// 2. tools/list
const list = await llamar({ jsonrpc: '2.0', id: 2, method: 'tools/list' })
const nombres = (list.json?.result?.tools || []).map((t) => t.name)
if (['search', 'get_item', 'list_registries'].every((n) => nombres.includes(n))) bien('tools/list trae las tres tools')
else mal(`tools/list incompleto: ${nombres.join(', ')}`)

// 3. search del criterio de la casa: fintech deja fuera los WebGL decorativos
const fin = await llamar({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'search', arguments: { arquetipo: 'fintech', tipo: 'component' } } })
const comps = fin.json?.result?.structuredContent?.results || []
if (comps.length && comps.every((c) => c.name === 'Color Depth')) bien('search fintech descarta el WebGL decorativo')
else mal(`search fintech devolvió ${comps.map((c) => c.name).join(', ')}`)

// 4. get_item de una skill: trae su body (CC BY)
const sk = await llamar({ jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'get_item', arguments: { id: 'skill:diretto' } } })
const skItem = JSON.parse(sk.json?.result?.content?.[0]?.text || '{}')
if (skItem.files?.[0]?.content?.length > 0 && skItem.meta?.licencia === 'CC BY 4.0') bien('get_item skill trae body con licencia CC BY')
else mal('get_item skill sin body o sin licencia')

// 5. get_item de un componente: metadata sí, código NO (guardia de licencia)
const cp = await llamar({ jsonrpc: '2.0', id: 5, method: 'tools/call', params: { name: 'get_item', arguments: { id: 'component:bubble' } } })
const cpItem = JSON.parse(cp.json?.result?.content?.[0]?.text || '{}')
if (Array.isArray(cpItem.files) && cpItem.files.length === 0 && cpItem.meta?.install) bien('get_item componente: sin código, con comando de instalación')
else mal('get_item componente filtra código o no da instalación')

// 6. item inexistente -> isError
const no = await llamar({ jsonrpc: '2.0', id: 6, method: 'tools/call', params: { name: 'get_item', arguments: { id: 'no-existe' } } })
if (no.json?.result?.isError) bien('get_item inexistente devuelve isError')
else mal('get_item inexistente no marca error')

// 7. método desconocido -> error JSON-RPC
const raro = await llamar({ jsonrpc: '2.0', id: 7, method: 'metodo/raro' })
if (raro.json?.error?.code === -32601) bien('método desconocido devuelve -32601')
else mal('método desconocido no devuelve el error esperado')

// 8. notificación -> 202 sin cuerpo
const notif = await llamar({ jsonrpc: '2.0', method: 'notifications/initialized' })
if (notif.status === 202) bien('notificación devuelve 202')
else mal(`notificación devolvió ${notif.status}`)

console.log(fallos === 0 ? '\n  MCP en pie: 8 comprobaciones pasan' : `\n  ${fallos} comprobación(es) fallida(s)`)
process.exit(fallos ? 1 : 0)
