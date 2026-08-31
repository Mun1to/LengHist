// Prueba de humo del MCP sin tocar la red: ejercita el endpoint entero contra el
// catálogo propio y comprueba los invariantes que no pueden romperse.
//
//   pnpm mcp
//
// No federa (eso necesita internet y lo cubre `pnpm registro`): aquí se comprueba
// que el protocolo responde, que search filtra por el criterio de la casa, que
// get_item respeta la licencia (skill con body, componente sin código) y que los
// errores JSON-RPC salen bien.
import { onRequestPost, onRequestGet, onRequestOptions } from '../functions/api/mcp.js'

let fallos = 0
let pasadas = 0
const mal = (msg) => { console.log(`  ✗ ${msg}`); fallos++ }
const bien = (msg) => { console.log(`  ✓ ${msg}`); pasadas++ }

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

// 3. search del criterio de la casa: fintech deja fuera los WebGL decorativos.
//    Se comprueba la INTENCION (que los descarta), no una lista cerrada: hasta el
//    2026-08-31 esto exigia que el resultado fuera exactamente «Color Depth», asi
//    que al publicar tres piezas propias el 29 se puso en rojo sin que fallara nada.
//    Una comprobacion que se rompe al añadir contenido acaba ignorandose.
const DECORATIVOS = ['Bubble', 'Cloth']
const fin = await llamar({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'search', arguments: { arquetipo: 'fintech', tipo: 'component' } } })
const comps = fin.json?.result?.structuredContent?.results || []
const todos = await llamar({ jsonrpc: '2.0', id: 31, method: 'tools/call', params: { name: 'search', arguments: { tipo: 'component', limit: 100 } } })
const total = todos.json?.result?.structuredContent?.count || 0
const cuela = comps.filter((c) => DECORATIVOS.includes(c.name)).map((c) => c.name)
if (comps.length && !cuela.length && comps.length < total) bien(`search fintech descarta el WebGL decorativo (${comps.length} de ${total})`)
else if (cuela.length) mal(`search fintech deja pasar decorativos: ${cuela.join(', ')}`)
else mal(`search fintech devolvió ${comps.length} de ${total} componentes`)

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

// 9. el conocimiento propio (conceptos) está en la búsqueda y get_item trae su prompt
const con = await llamar({ jsonrpc: '2.0', id: 9, method: 'tools/call', params: { name: 'search', arguments: { tipo: 'concept', query: 'parallax' } } })
const conRes = con.json?.result?.structuredContent?.results || []
let conPrompt = false
if (conRes[0]) {
  const full = await llamar({ jsonrpc: '2.0', id: 10, method: 'tools/call', params: { name: 'get_item', arguments: { id: conRes[0].id } } })
  conPrompt = Boolean(JSON.parse(full.json?.result?.content?.[0]?.text || '{}').prompt)
}
if (conRes.length && conPrompt) bien('search concept encuentra y get_item trae el prompt')
else mal('el conocimiento (conceptos) no aparece o no trae prompt')


// --- El transporte, que hasta el 2026-08-31 no comprobaba nadie ---
//
// Este bloque existe por un incidente real: el GET del stream devolvia 200 con la
// tarjeta de salud en vez del 405 que manda la spec, y los clientes MCP lo leian
// como una conexion caida y reconectaban en el acto. Una sola maquina dio 117.764
// vueltas en nueve horas y se comio el cupo diario entero de Pages Functions.
// El fallo vivio diez dias porque este archivo solo importaba `onRequestPost`.

const get = (accept) => onRequestGet({ request: new Request('http://localhost/api/mcp', { headers: { accept } }) })

// 10. El GET del stream SSE: 405, o el cliente se queda reconectando para siempre.
const sse = await get('text/event-stream')
if (sse.status === 405 && (sse.headers.get('allow') || '').includes('POST')) bien('GET con text/event-stream devuelve 405 y Allow')
else mal(`GET con text/event-stream devolvio ${sse.status} (tiene que ser 405: es lo que corta el bucle de reconexion)`)

// 11. Un cliente que pide las dos cosas sigue siendo un cliente MCP, no un navegador.
const mixto = await get('application/json, text/event-stream')
if (mixto.status === 405) bien('GET con json + event-stream tambien devuelve 405')
else mal(`GET con json + event-stream devolvio ${mixto.status}`)

// 12. El navegador sigue viendo su pagina.
const html = await get('text/html,application/xhtml+xml')
if (html.status === 200 && (html.headers.get('content-type') || '').includes('text/html')) bien('GET de navegador sigue dando la pagina')
else mal(`GET de navegador devolvio ${html.status}`)

// 13. Y la tarjeta de salud, para todo lo demas.
const salud = await get('*/*')
if (salud.status === 200 && JSON.parse(await salud.text()).name === 'vibeset') bien('GET normal da la tarjeta de salud')
else mal(`GET normal devolvio ${salud.status}`)

// 14. OPTIONS, que es lo que pregunta un navegador antes de un POST de otro origen.
const opt = onRequestOptions()
if (opt.status === 204 && opt.headers.get('access-control-allow-origin') === '*') bien('OPTIONS devuelve 204 con CORS')
else mal(`OPTIONS devolvio ${opt.status}`)

console.log(fallos === 0 ? `\n  MCP en pie: ${pasadas} comprobaciones pasan` : `\n  ${fallos} comprobación(es) fallida(s)`)
process.exit(fallos ? 1 : 0)
