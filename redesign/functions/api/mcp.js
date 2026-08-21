// El MCP de Vibeset: la despensa de componentes y skills servida por un endpoint,
// para que cualquier agente pueda buscar una pieza y pedir cómo instalarla.
//
// Vive en functions/ porque Cloudflare Pages publica esa carpeta como endpoint sin
// configurar nada, igual que /api/estrellas. En dev no lo ejecuta Vite: el mismo
// endpoint lo levanta un plugin de vite.config.js, llamando a ESTAS funciones.
//
// Transporte: Streamable HTTP. Un POST con un mensaje JSON-RPC 2.0 y una respuesta
// application/json. Se hace el JSON-RPC a mano y no con el SDK oficial porque sus
// transportes asumen el req/res de Node, y aquí corre el runtime de Workers con
// fetch/Request/Response. La superficie es diminuta y estable, así que sale a
// cuenta.
//
// Regla de licencias (ver src/lib/registro.js y LICENSING.md): get_item sirve el
// body ENTERO de una skill (CC BY de la casa), pero de un componente solo devuelve
// metadata + el comando de instalación del ORIGEN, nunca el código de terceros.
import { buscarCatalogo, itemRegistro } from '../../src/lib/registro.js'
import { REGISTRIES } from '../../src/data/registries.js'

const SERVER = { name: 'vibeset', version: '0.1.0' }
const PROTOCOL = '2025-06-18'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Mcp-Session-Id, MCP-Protocol-Version',
}

const TOOLS = [
  {
    name: 'search',
    description:
      'Busca componentes y skills en el catálogo de Vibeset. Filtra por tipo, por arquetipo de web (marca-creativa, portfolio, lanzamiento, saas, fintech, ecommerce, editorial, evento), por si el movimiento respeta la política de accesibilidad (dial), y por accesibilidad. Devuelve metadata y el comando de instalación del origen, nunca el código.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Texto libre. Busca en nombre, descripción y etiquetas, en los dos idiomas.' },
        tipo: { type: 'string', enum: ['component', 'skill'] },
        arquetipo: { type: 'string', description: 'Deja fuera los componentes que no encajan en ese arquetipo. Las skills no se filtran por esto.' },
        dial: { type: 'string', enum: ['ok', 'any'], description: '"ok" descarta el movimiento decorativo de gran amplitud que no cumple la política de la casa.' },
        a11y: { type: 'string', enum: ['ok', 'decorativo', 'requiere-refuerzo'] },
        source: { type: 'string', enum: ['own', 'federated', 'all'], description: '"own" (catálogo propio), "federated" (registries de terceros indexados) o "all". La federación se omite si filtras por criterio de la casa.' },
        lang: { type: 'string', enum: ['es', 'en'] },
        limit: { type: 'number' },
      },
    },
  },
  {
    name: 'get_item',
    description:
      'Trae un item completo por su id (por ejemplo "skill:diretto" o "component:bubble"). Una skill viene con su SKILL.md entero; un componente, con metadata y el comando de instalación de su registry de origen.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        lang: { type: 'string', enum: ['es', 'en'] },
      },
      required: ['id'],
    },
  },
  {
    name: 'list_registries',
    description: 'Enumera los registries de componentes de terceros que Vibeset indexa y enlaza (nunca rehospeda).',
    inputSchema: { type: 'object', properties: {} },
  },
]

const CACHE_FED = 900

// Federación read-only: lee el índice (metadata pura) de cada registry externo,
// cacheado en el borde, y devuelve título, descripción y el comando de instalación
// del ORIGEN. Nunca pide las URLs por item, así que el código de terceros no toca
// este servidor jamás. Un origen que se cae o no da JSON no rompe la búsqueda.
async function buscarFederado(query, limitePorOrigen) {
  const q = String(query || '').trim().toLowerCase()
  const tandas = await Promise.all(REGISTRIES.map(async (reg) => {
    const ctrl = new AbortController()
    const reloj = setTimeout(() => ctrl.abort(), 8000)
    try {
      const r = await fetch(reg.indexUrl, {
        headers: { accept: 'application/json' },
        cf: { cacheTtl: CACHE_FED, cacheEverything: true },
        signal: ctrl.signal,
      })
      if (!r.ok) return []
      const data = await r.json()
      const items = Array.isArray(data?.items) ? data.items : []
      return items
        .filter((it) => it && it.name)
        .filter((it) => !q || `${it.name} ${it.title || ''} ${it.description || ''}`.toLowerCase().includes(q))
        .slice(0, limitePorOrigen)
        .map((it) => ({
          id: `${reg.key}:${it.name}`,
          source: 'federated',
          type: (it.type || 'registry:component').replace('registry:', ''),
          name: it.title || it.name,
          title: it.title || it.name,
          description: it.description || '',
          homepage: reg.homepage,
          install: `pnpm dlx shadcn@latest add ${reg.namespace}/${it.name}`,
          registry: reg.name,
          license: reg.license,
        }))
    } catch {
      return []
    } finally {
      clearTimeout(reloj)
    }
  }))
  return tandas.flat()
}

// Ejecuta una tool. La federación hace fetch a los registries externos.
async function ejecutarTool(name, args = {}) {
  if (name === 'search') {
    const { query = '', source = 'own', ...filtros } = args
    const propios = source === 'federated' ? [] : buscarCatalogo(query, filtros)
    // El criterio de la casa no se puede afirmar sobre piezas de terceros, así que
    // cuando se filtra por él, la federación se queda fuera.
    const pideCriterio = Boolean(filtros.arquetipo || filtros.dial === 'ok' || filtros.a11y)
    let federados = []
    let nota
    if (source === 'federated' || source === 'all') {
      if (pideCriterio) {
        nota = 'La federación se omite al filtrar por criterio de la casa (arquetipo/dial/a11y): no se puede garantizar sobre piezas de terceros.'
      } else {
        const tope = typeof filtros.limit === 'number' ? filtros.limit : 10
        federados = await buscarFederado(query, tope)
      }
    }
    const results = [...propios, ...federados]
    return { ok: true, data: { results, count: results.length, source, ...(nota ? { nota } : {}) } }
  }
  if (name === 'get_item') {
    const item = itemRegistro(args.id, args.lang || 'es')
    if (!item) return { ok: false, mensaje: `no existe el item ${args.id}` }
    return { ok: true, data: item }
  }
  if (name === 'list_registries') {
    const registries = REGISTRIES.map((r) => ({
      name: r.name, homepage: r.homepage, namespace: r.namespace, license: r.license, verificado: r.verificado,
    }))
    return { ok: true, data: { registries } }
  }
  return { ok: false, mensaje: `tool desconocida: ${name}` }
}

const respuesta = (id, result) => ({ jsonrpc: '2.0', id, result })
const errorRpc = (id, code, message) => ({ jsonrpc: '2.0', id, error: { code, message } })

async function manejar(m) {
  const { id, method, params } = m || {}
  switch (method) {
    case 'initialize':
      return respuesta(id, {
        protocolVersion: params?.protocolVersion || PROTOCOL,
        capabilities: { tools: {} },
        serverInfo: SERVER,
      })
    case 'tools/list':
      return respuesta(id, { tools: TOOLS })
    case 'tools/call': {
      const res = await ejecutarTool(params?.name, params?.arguments)
      if (!res.ok) return respuesta(id, { content: [{ type: 'text', text: res.mensaje }], isError: true })
      return respuesta(id, {
        content: [{ type: 'text', text: JSON.stringify(res.data) }],
        structuredContent: res.data,
      })
    }
    case 'ping':
      return respuesta(id, {})
    default:
      return errorRpc(id, -32601, `método no soportado: ${method}`)
  }
}

function json(obj, status = 200) {
  return new Response(obj === null ? '' : JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS },
  })
}

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS })
}

// GET: descubrimiento y salud. No es un stream SSE; los clientes de tools usan POST.
export function onRequestGet() {
  return json({ ...SERVER, protocol: PROTOCOL, transport: 'streamable-http', tools: TOOLS.map((t) => t.name) })
}

export async function onRequestPost({ request }) {
  let mensaje
  try {
    mensaje = await request.json()
  } catch {
    return json(errorRpc(null, -32700, 'JSON inválido'), 400)
  }
  // Las notificaciones no llevan id y no se responden (solo se acusa recibo).
  if (mensaje && mensaje.id === undefined && typeof mensaje.method === 'string') {
    return new Response(null, { status: 202, headers: CORS })
  }
  return json(await manejar(mensaje))
}
