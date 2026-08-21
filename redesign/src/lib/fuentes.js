// Las fuentes EXTERNAS del MCP, apartadas del transporte. Todo lo que sale a la red
// vive aquí: la federación de registries de terceros y la búsqueda de iconos en
// Iconify. Es una lib de datos, sin nada del protocolo MCP; la orquesta mcp.js.
//
// Regla de licencias (LICENSING.md): se indexa metadata y se enlaza al origen. El
// código de terceros no se copia ni se sirve jamás; de los registries solo se lee
// su índice (metadata pura), nunca las URLs por item.
import { REGISTRIES } from '../data/registries.js'

const CACHE_FED = 900
const ICONIFY = 'https://api.iconify.design'
const CACHE_ICONOS = 3600
const DIRECTORIO_SHADCN = 'https://ui.shadcn.com/r/registries.json'

// La lista curada que se federa en vivo, en vista corta.
export function registriesCurados() {
  return REGISTRIES.map((r) => ({
    name: r.name, homepage: r.homepage, namespace: r.namespace, license: r.license, verificado: r.verificado,
  }))
}

// El registry cuyo `key` prefija un id federado (kokonutui:foo -> Kokonut UI).
export function registryDeId(id) {
  if (typeof id !== 'string') return null
  return REGISTRIES.find((r) => id.startsWith(`${r.key}:`)) || null
}

// Descubrimiento: el directorio OFICIAL de shadcn (289 registries), cacheado. No es
// lo que se federa en vivo (eso son los 12 curados), sino el mapa entero del
// ecosistema, para que el agente sepa qué existe. Marca cuáles ya federamos.
export async function listarDirectorio(query) {
  const q = String(query || '').trim().toLowerCase()
  const ctrl = new AbortController()
  const reloj = setTimeout(() => ctrl.abort(), 8000)
  try {
    const r = await fetch(DIRECTORIO_SHADCN, {
      headers: { accept: 'application/json' },
      cf: { cacheTtl: CACHE_FED, cacheEverything: true },
      signal: ctrl.signal,
    })
    if (!r.ok) return { ok: false, mensaje: `el directorio de shadcn respondió ${r.status}` }
    const data = await r.json()
    const arr = Array.isArray(data) ? data : Array.isArray(data?.registries) ? data.registries : []
    const federados = new Set(REGISTRIES.map((x) => x.namespace))
    let registries = arr
      .filter((d) => d && d.name)
      .map((d) => ({
        namespace: d.name,
        homepage: d.homepage || null,
        description: d.description || null,
        federado: federados.has(d.name),
      }))
    if (q) registries = registries.filter((d) => `${d.namespace} ${d.description || ''}`.toLowerCase().includes(q))
    return { ok: true, data: { registries, count: registries.length, source: 'directory' } }
  } catch (e) {
    return { ok: false, mensaje: e.name === 'AbortError' ? 'el directorio no contestó en 8s' : 'no se pudo leer el directorio de shadcn' }
  } finally {
    clearTimeout(reloj)
  }
}

// Relevancia de un item federado a la query: el nombre pesa más que la descripción.
export function scoreFederado(it, q) {
  if (!q) return 0
  const n = (it.name || '').toLowerCase()
  if (n.startsWith(q)) return 3
  if (n.includes(q)) return 2
  if ((it.description || '').toLowerCase().includes(q)) return 1
  return 0
}

// Federación read-only: lee el índice (metadata pura) de cada registry curado,
// cacheado en el borde, y devuelve título, descripción y el comando de instalación
// del ORIGEN. Nunca pide las URLs por item, así que el código de terceros no toca
// este servidor jamás. Un origen que se cae o no da JSON no rompe la búsqueda.
export async function buscarFederado(query, limitePorOrigen) {
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

// Del SPDX de la licencia, si el icono se puede usar en un producto comercial. La
// mayoría de sets de Iconify son permisivos, pero hay copyleft y no-comerciales, y
// un icono servido «porque es open source» sin mirar la licencia sería un error.
function comercialDe(spdx) {
  if (!spdx) return 'desconocido'
  const s = spdx.toUpperCase()
  if (s.includes('NC')) return false
  if (/^A?GPL|^LGPL/.test(s)) return 'copyleft'
  if (s.startsWith('CC-BY-SA')) return 'atribución-compartir-igual'
  if (s.startsWith('CC-BY')) return 'atribución'
  return true // MIT, Apache, ISC, CC0, BSD, MPL, Unlicense…
}

// Busca iconos en la API pública de Iconify (sin key, desde el Worker). Devuelve el
// nombre, el set, la licencia y la URL del SVG; nunca hospeda el SVG, enlaza al de
// Iconify, que además ya trae la licencia de cada set en la respuesta de búsqueda.
export async function buscarIconos(query, set, limit) {
  const q = String(query || '').trim()
  if (!q) return { ok: false, mensaje: 'search_icons necesita una query.' }
  const tope = Math.min(Math.max(1, Number(limit) || 24), 100)
  const url = new URL(`${ICONIFY}/search`)
  url.searchParams.set('query', q)
  url.searchParams.set('limit', String(Math.max(tope, 32))) // Iconify: mínimo 32
  if (set) url.searchParams.set('prefix', set)
  const ctrl = new AbortController()
  const reloj = setTimeout(() => ctrl.abort(), 8000)
  try {
    const r = await fetch(url, { headers: { accept: 'application/json' }, cf: { cacheTtl: CACHE_ICONOS, cacheEverything: true }, signal: ctrl.signal })
    if (!r.ok) return { ok: false, mensaje: `Iconify respondió ${r.status}` }
    const data = await r.json()
    const cols = data.collections || {}
    const icons = (data.icons || []).slice(0, tope).map((full) => {
      const prefix = full.split(':')[0]
      const col = cols[prefix] || {}
      const lic = col.license || {}
      return {
        name: full,
        set: col.name || prefix,
        license: lic.spdx || lic.title || 'desconocida',
        licenseUrl: lic.url || null,
        author: col.author?.name || null,
        commercial: comercialDe(lic.spdx),
        svgUrl: `${ICONIFY}/${full.replace(':', '/')}.svg`,
      }
    })
    return { ok: true, data: { icons, count: icons.length, total: data.total || icons.length } }
  } catch (e) {
    return { ok: false, mensaje: e.name === 'AbortError' ? 'Iconify no contestó en 8s' : 'no se pudo consultar Iconify' }
  } finally {
    clearTimeout(reloj)
  }
}
