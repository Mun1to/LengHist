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

// Lo que el cliente enseña al modelo para que use el server bien, no a ciegas.
const INSTRUCTIONS = [
  'Vibeset is a catalogue of web components and agent skills, searchable with house design criteria.',
  'Use search to find pieces: pass arquetipo (the site archetype: fintech, saas, ecommerce, marca-creativa, portfolio, lanzamiento, editorial, evento) and dial:"ok" to get pieces that fit and respect motion-accessibility. The server drops heavy decorative WebGL for sober archetypes on its own.',
  'source:"own" is the curated Vibeset catalogue; source:"all" also reaches the federated third-party registries (~1,400 components). Federation is skipped when you filter by house criteria.',
  'Use get_item for a skill\'s full SKILL.md or a component\'s metadata and origin install command. The server links to third-party code, it never rehosts it.',
].join(' ')

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
        grupo: { type: 'string', description: 'Grupo del catálogo. Componentes: canvas, cursor, scroll, texto, ui. Skills: web, codigo, flujo, escritura.' },
        arquetipo: { type: 'string', description: 'Deja fuera los componentes que no encajan en ese arquetipo. Las skills no se filtran por esto.' },
        dial: { type: 'string', enum: ['ok', 'any'], description: '"ok" descarta el movimiento decorativo de gran amplitud que no cumple la política de la casa.' },
        a11y: { type: 'string', enum: ['ok', 'decorativo', 'requiere-refuerzo'] },
        source: { type: 'string', enum: ['own', 'federated', 'all'], description: '"own" (catálogo propio), "federated" (registries de terceros indexados) o "all". La federación se omite si filtras por criterio de la casa.' },
        lang: { type: 'string', enum: ['es', 'en'] },
        limit: { type: 'number' },
      },
    },
    outputSchema: {
      type: 'object',
      properties: {
        results: { type: 'array', items: { type: 'object' } },
        count: { type: 'number' },
        source: { type: 'string' },
        nota: { type: 'string' },
      },
      required: ['results', 'count'],
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
    outputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        type: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        files: { type: 'array' },
        meta: { type: 'object' },
      },
    },
  },
  {
    name: 'list_registries',
    description: 'Enumera los registries de componentes de terceros que Vibeset indexa y enlaza (nunca rehospeda).',
    inputSchema: { type: 'object', properties: {} },
    outputSchema: {
      type: 'object',
      properties: { registries: { type: 'array', items: { type: 'object' } } },
      required: ['registries'],
    },
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
      // Unos registries exponen { items: [...] }; otros, el array suelto.
      const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : []
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

// Relevancia de un item federado a la query: el nombre pesa más que la descripción.
function scoreFederado(it, q) {
  if (!q) return 0
  const n = (it.name || '').toLowerCase()
  if (n.startsWith(q)) return 3
  if (n.includes(q)) return 2
  if ((it.description || '').toLowerCase().includes(q)) return 1
  return 0
}

const CRITERIO = 'La federación se omite al filtrar por criterio de la casa (arquetipo/dial/a11y): no se puede garantizar sobre piezas de terceros.'

// Ejecuta una tool. La federación hace fetch a los registries externos.
async function ejecutarTool(name, args = {}) {
  if (name === 'search') {
    const { query = '', source = 'own', ...filtros } = args
    // El criterio de la casa no se puede afirmar sobre piezas de terceros.
    const pideCriterio = Boolean(filtros.arquetipo || filtros.dial === 'ok' || filtros.a11y)
    const federar = (source === 'federated' || source === 'all') && !pideCriterio

    if (!federar) {
      const results = source === 'federated' ? [] : buscarCatalogo(query, filtros)
      const nota = source !== 'own' && pideCriterio ? CRITERIO : undefined
      return { ok: true, data: { results, count: results.length, source, ...(nota ? { nota } : {}) } }
    }

    // Camino federado: propio + externo, rankeado y cortado a un límite global.
    const q = String(query || '').toLowerCase().trim()
    const propios = source === 'federated' ? [] : buscarCatalogo(query, { ...filtros, limit: undefined })
    const federados = await buscarFederado(query, 8)
    federados.sort((a, b) => scoreFederado(b, q) - scoreFederado(a, q))
    const tope = Math.min(Math.max(1, Number(filtros.limit) || 20), 100)
    const results = [...propios, ...federados].slice(0, tope)
    return { ok: true, data: { results, count: results.length, source } }
  }
  if (name === 'get_item') {
    const item = itemRegistro(args.id, args.lang || 'es')
    if (item) return { ok: true, data: item }
    // Si el id es de un registry federado, orientar en vez de un seco «no existe».
    const reg = REGISTRIES.find((r) => typeof args.id === 'string' && args.id.startsWith(`${r.key}:`))
    if (reg) return { ok: false, mensaje: `«${args.id}» es de ${reg.name}, un registry federado. Sus items llegan completos en search con source:"federated" o "all"; se instala desde ${reg.homepage}.` }
    return { ok: false, mensaje: `no existe el item ${args.id}` }
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
        instructions: INSTRUCTIONS,
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
