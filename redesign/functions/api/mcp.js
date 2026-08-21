// El MCP de Vibeset: la despensa de componentes, skills y conocimiento servida por
// un endpoint, para que cualquier agente pueda buscar una pieza y pedir cómo usarla.
//
// Vive en functions/ porque Cloudflare Pages publica esa carpeta como endpoint sin
// configurar nada, igual que /api/estrellas. En dev no lo ejecuta Vite: el mismo
// endpoint lo levanta un plugin de vite.config.js, llamando a ESTAS funciones.
//
// Este archivo es SOLO el transporte MCP: el protocolo JSON-RPC, las tools y la
// orquestación. El catálogo propio vive en src/lib/registro.js y las fuentes
// externas (federación, iconos, directorio) en src/lib/fuentes.js.
//
// Transporte: Streamable HTTP. Un POST con un mensaje JSON-RPC 2.0 y una respuesta
// application/json. Se hace el JSON-RPC a mano y no con el SDK oficial porque sus
// transportes asumen el req/res de Node, y aquí corre el runtime de Workers con
// fetch/Request/Response. La superficie es diminuta y estable, así que sale a cuenta.
import { buscarCatalogo, itemRegistro } from '../../src/lib/registro.js'
import { buscarFederado, scoreFederado, buscarIconos, listarDirectorio, registriesCurados, registryDeId } from '../../src/lib/fuentes.js'
import { paginaMcp } from '../../src/lib/paginaMcp.js'

const SERVER = { name: 'vibeset', version: '0.1.0' }
const PROTOCOL = '2025-06-18'

// Lo que el cliente enseña al modelo para que use el server bien, no a ciegas.
const INSTRUCTIONS = [
  'Vibeset is a catalogue of web components and agent skills, searchable with house design criteria.',
  'Use search to find pieces: pass arquetipo (the site archetype: fintech, saas, ecommerce, marca-creativa, portfolio, lanzamiento, editorial, evento) and dial:"ok" to get pieces that fit and respect motion-accessibility. The server drops heavy decorative WebGL for sober archetypes on its own.',
  'source:"own" is the curated Vibeset catalogue; source:"all" also reaches the federated third-party registries (~4,400 components across 12 sources). Federation is skipped when you filter by house criteria.',
  'The catalogue also holds design concepts (each with a ready-to-run prompt), tips and a resource directory; reach them with tipo:"concept", "tip" or "resource".',
  'Use get_item for a skill\'s full SKILL.md, a concept with its prompt, or a component\'s metadata and origin install command. The server links to third-party code, it never rehosts it.',
  'For icons, use search_icons (Iconify: 236 sets, ~334k icons, no key): each result carries its set, SPDX licence, whether it is commercial-safe, and the SVG URL.',
  'list_registries with source:"directory" lists the whole official shadcn registry directory (289 sources) for discovery; the 12 curated ones are what search federates live.',
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
      'Busca en el catálogo de Vibeset: componentes, skills, conceptos de diseño web, consejos y recursos. Filtra por tipo, por arquetipo de web (marca-creativa, portfolio, lanzamiento, saas, fintech, ecommerce, editorial, evento), por si el movimiento respeta la política de accesibilidad (dial), y por accesibilidad. De los componentes devuelve metadata y el comando de instalación del origen, nunca el código; los conceptos traen un prompt listo para el agente.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Texto libre. Busca en nombre, descripción y etiquetas, en los dos idiomas.' },
        tipo: { type: 'string', enum: ['component', 'skill', 'concept', 'tip', 'resource'] },
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
      'Trae un item completo por su id (por ejemplo "skill:diretto", "component:bubble" o "concept:parallax"). Una skill viene con su SKILL.md entero, un concepto con su prompt; un componente, con metadata y el comando de instalación de su registry de origen.',
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
    description: 'Enumera los registries de componentes de terceros. Por defecto (source:"curated"), los 12 que Vibeset federa en vivo. Con source:"directory", los 289 del directorio oficial de shadcn, para descubrir todo el ecosistema. Vibeset indexa y enlaza, nunca rehospeda.',
    inputSchema: {
      type: 'object',
      properties: {
        source: { type: 'string', enum: ['curated', 'directory'] },
        query: { type: 'string', description: 'Solo con source:"directory": filtra los 289 por nombre o descripción.' },
      },
    },
    outputSchema: {
      type: 'object',
      properties: { registries: { type: 'array', items: { type: 'object' } }, count: { type: 'number' } },
      required: ['registries'],
    },
  },
  {
    name: 'search_icons',
    description: 'Busca iconos en Iconify (236 sets, ~334.000 iconos open source). Devuelve, por icono, su nombre (prefix:name), el set, la licencia SPDX, si permite uso comercial y la URL del SVG. Sin API key.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Qué buscar: "home", "arrow-right", "cart"…' },
        set: { type: 'string', description: 'Limita a un set por su prefijo Iconify (lucide, tabler, mdi, ph, heroicons, simple-icons…).' },
        limit: { type: 'number' },
      },
      required: ['query'],
    },
    outputSchema: {
      type: 'object',
      properties: {
        icons: { type: 'array', items: { type: 'object' } },
        count: { type: 'number' },
        total: { type: 'number' },
      },
      required: ['icons', 'count'],
    },
  },
]

const CRITERIO = 'La federación se omite al filtrar por criterio de la casa (arquetipo/dial/a11y): no se puede garantizar sobre piezas de terceros.'

async function toolSearch(args) {
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

function toolGetItem(args) {
  const item = itemRegistro(args.id, args.lang || 'es')
  if (item) return { ok: true, data: item }
  // Si el id es de un registry federado, orientar en vez de un seco «no existe».
  const reg = registryDeId(args.id)
  if (reg) return { ok: false, mensaje: `«${args.id}» es de ${reg.name}, un registry federado. Sus items llegan completos en search con source:"federated" o "all"; se instala desde ${reg.homepage}.` }
  return { ok: false, mensaje: `no existe el item ${args.id}` }
}

async function toolListRegistries(args) {
  if (args.source === 'directory') return listarDirectorio(args.query)
  const registries = registriesCurados()
  return { ok: true, data: { registries, count: registries.length, source: 'curated' } }
}

async function ejecutarTool(name, args = {}) {
  if (name === 'search') return toolSearch(args)
  if (name === 'get_item') return toolGetItem(args)
  if (name === 'list_registries') return toolListRegistries(args)
  if (name === 'search_icons') return buscarIconos(args.query, args.set, args.limit)
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

// GET: una página para humanos si lo abre un navegador (Accept: text/html), o la
// tarjeta de salud JSON para todo lo demás. No es un stream SSE; las tools usan POST.
export function onRequestGet({ request } = {}) {
  const acepta = request?.headers?.get('accept') || ''
  if (acepta.includes('text/html')) {
    // El idioma del visitante decide es/en, como el resto del sitio. Vary para que
    // una caché no le sirva a un inglés la versión que pidió un español.
    const primero = (request?.headers?.get('accept-language') || '').split(',')[0].trim().toLowerCase()
    const lang = primero.startsWith('es') ? 'es' : 'en'
    return new Response(paginaMcp(lang), {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Content-Language': lang, Vary: 'Accept, Accept-Language', ...CORS },
    })
  }
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
