// El registro de Vibeset en formato shadcn, generado desde el mismo catálogo que
// alimenta el sitio. Es una lib pura, sin efectos: la comparten el endpoint MCP
// (functions/api/mcp.js), la emulación en dev (vite.config.js) y el generador
// estático del build. Una sola fuente de verdad, como src/lib/totales.js.
//
// Regla dura de licencias (LICENSING.md): las 18 skills son CC BY de la casa y se
// sirven ENTERAS (su body va en files[].content). Los 12 componentes son de
// canvasui/arlan y NO son nuestros: se sirven como metadata + comando de
// instalación del origen, con files SIEMPRE vacío. Lo mismo vale para lo federado.
import { COMPONENT_ITEMS } from '../data/components.js'
import { SKILL_ITEMS, authorOf, repoOf } from '../data/skills.js'
import { META_CASA } from '../data/registro-meta.js'

const SCHEMA_REGISTRO = 'https://ui.shadcn.com/schema/registry.json'
const SCHEMA_ITEM = 'https://ui.shadcn.com/schema/registry-item.json'
const HOMEPAGE = 'https://vibeset.dev'
const ATRIBUCION = 'Content from Vibeset by Munir Torres — https://vibeset.dev — CC BY 4.0'

// Del comando de instalación de origen saca la dependencia de registry shadcn.
// 'pnpm dlx shadcn@latest add @canvas-ui/bubble-react' -> '@canvas-ui/bubble-react'.
function depDeInstall(install) {
  if (!install) return []
  const m = install.match(/@[\w-]+\/[\w-]+/)
  return m ? [m[0]] : []
}

function juntar(...trozos) {
  return trozos.filter(Boolean).join(' ').toLowerCase()
}

function normalizarComponente(item) {
  const meta = META_CASA[item.key] || {}
  return {
    id: `component:${item.key}`,
    source: 'own',
    type: 'component',
    key: item.key,
    name: item.name,
    grupo: item.group,
    origin: item.origin,
    install: item.install || null,
    homepage: item.url,
    deps: item.deps || [],
    labels: item.labels || [],
    tag: item.tag,
    desc: item.desc,
    meta,
    buscable: juntar(item.key, item.name, item.tag?.es, item.tag?.en, item.desc?.es, item.desc?.en, ...(item.labels || []), ...(meta.arquetipos || [])),
  }
}

function normalizarSkill(item) {
  return {
    id: `skill:${item.key}`,
    source: 'own',
    type: 'skill',
    key: item.key,
    name: item.name,
    nameEn: item.nameEn,
    homepage: repoOf(item),
    plugin: item.plugin || null,
    grupo: item.group,
    autor: authorOf(item).name,
    es: item.es,
    en: item.en,
    meta: {},
    buscable: juntar(item.key, item.name, item.nameEn, item.es?.label, item.en?.label, item.es?.what, item.en?.what, item.es?.description, item.en?.description),
  }
}

// El catálogo propio normalizado, una sola vez. 12 componentes + 18 skills.
const CATALOGO = [
  ...COMPONENT_ITEMS.map(normalizarComponente),
  ...SKILL_ITEMS.map(normalizarSkill),
]

function vistaCorta(x, lang) {
  if (x.type === 'component') {
    return {
      id: x.id,
      source: x.source,
      type: x.type,
      name: x.name,
      title: x.name,
      description: (x.tag && (x.tag[lang] || x.tag.es)) || '',
      homepage: x.homepage,
      install: x.install,
      meta: { ...x.meta, grupo: x.grupo },
    }
  }
  const t = x[lang] || x.es
  return {
    id: x.id,
    source: x.source,
    type: x.type,
    name: x.name,
    title: t.label,
    description: t.what,
    homepage: x.homepage,
    install: x.plugin ? `plugin: ${x.plugin}` : null,
    meta: { grupo: x.grupo, autor: x.autor },
  }
}

// La despensa propia en vista corta. La consume list/search del MCP.
export function catalogoPropio(lang = 'es') {
  return CATALOGO.map((x) => vistaCorta(x, lang))
}

// Puntúa un match: pesa más en el nombre que en la etiqueta, y en la etiqueta más
// que en la descripción. Sin esto, el orden era el del catálogo y una skill salía
// por delante del componente que llevaba la palabra en el título.
function puntuar(x, q) {
  const en = (s) => (s || '').toLowerCase()
  const nombre = `${en(x.key)} ${en(x.name)}`
  let s = 0
  if (nombre.startsWith(q)) s += 5
  if (nombre.includes(q)) s += 3
  if (x.type === 'component') {
    if ((en(x.tag?.es) + en(x.tag?.en)).includes(q)) s += 2
    if ((en(x.desc?.es) + en(x.desc?.en)).includes(q)) s += 1
    if ((x.labels || []).some((l) => en(l).includes(q))) s += 1
  } else {
    if ((en(x.es?.label) + en(x.en?.label)).includes(q)) s += 2
    if ((en(x.es?.what) + en(x.en?.what) + en(x.es?.description) + en(x.en?.description)).includes(q)) s += 1
  }
  return s
}

// Búsqueda en memoria sobre lo propio. Filtros:
// - tipo: 'component' | 'skill'
// - grupo: canvas/cursor/scroll/texto/ui (componentes) o web/codigo/flujo/escritura (skills).
// - arquetipo: solo descarta componentes que no encajen; las skills nunca se caen
//   por este filtro (no tienen arquetipo).
// - dial: 'ok' deja fuera el movimiento decorativo que no cumple la política.
// - a11y: 'ok' | 'decorativo' | 'requiere-refuerzo'
// - limit: corta el resultado.
export function buscarCatalogo(query = '', filtros = {}) {
  const { tipo, grupo, arquetipo, dial, a11y, limit } = filtros
  const lang = filtros.lang || 'es'
  const q = String(query || '').trim().toLowerCase()
  let out = CATALOGO
  if (tipo) out = out.filter((x) => x.type === tipo)
  if (grupo) out = out.filter((x) => x.grupo === grupo)
  if (arquetipo) out = out.filter((x) => !x.meta.arquetipos || x.meta.arquetipos.includes(arquetipo))
  if (dial === 'ok') out = out.filter((x) => x.meta.cumpleDial !== false)
  if (a11y) out = out.filter((x) => (x.meta.a11y || 'ok') === a11y)
  if (q) {
    out = out
      .filter((x) => x.buscable.includes(q))
      .map((x, i) => ({ x, i, s: puntuar(x, q) }))
      .sort((a, b) => b.s - a.s || a.i - b.i)
      .map((o) => o.x)
  }
  const resultados = out.map((x) => vistaCorta(x, lang))
  return typeof limit === 'number' ? resultados.slice(0, limit) : resultados
}

// El registry.json raíz: solo nombres, tipos y descripciones cortas.
export function indiceRegistro(lang = 'es') {
  return {
    $schema: SCHEMA_REGISTRO,
    name: 'vibeset',
    homepage: HOMEPAGE,
    items: CATALOGO.map((x) => {
      const v = vistaCorta(x, lang)
      return {
        name: x.key,
        type: x.type === 'component' ? 'registry:component' : 'registry:file',
        title: v.title,
        description: v.description,
      }
    }),
  }
}

// Un registry-item completo por id (o por key suelta). Aquí es donde se respeta la
// ley: skill -> con el body dentro; componente -> metadata + puntero, files vacío.
export function itemRegistro(id, lang = 'es') {
  const x = CATALOGO.find((c) => c.id === id) || CATALOGO.find((c) => c.key === id)
  if (!x) return null

  if (x.type === 'component') {
    return {
      $schema: SCHEMA_ITEM,
      name: x.key,
      type: 'registry:component',
      title: x.name,
      description: (x.desc && (x.desc[lang] || x.desc.es)) || '',
      homepage: x.homepage,
      dependencies: x.deps,
      registryDependencies: depDeInstall(x.install),
      files: [], // guardia dura: NUNCA el código de canvasui/arlan
      meta: {
        ...x.meta,
        origen: x.origin,
        install: x.install,
        instalacion: x.install ? 'shadcn' : 'manual',
        licencia: 'third-party', // ver LICENSING.md, se enlaza al origen
      },
    }
  }

  const t = x[lang] || x.es
  return {
    $schema: SCHEMA_ITEM,
    name: x.key,
    type: 'registry:file',
    title: t.label,
    description: t.description,
    files: [{ path: `${x.name}/SKILL.md`, type: 'registry:file', content: t.body }],
    meta: {
      grupo: x.grupo,
      autor: x.autor,
      repo: x.homepage,
      plugin: x.plugin,
      licencia: 'CC BY 4.0',
      atribucion: ATRIBUCION,
    },
  }
}
