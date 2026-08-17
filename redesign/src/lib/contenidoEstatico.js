// El contenido del sitio, escrito en HTML plano dentro de cada dirección.
//
// SOLO lo usa el build (`prerenderMeta` en vite.config.js). No lo importa nada
// de la aplicación, así que no entra en el bundle que descarga el visitante.
//
// Por qué existe. Hasta el 2026-08-17 el HTML servido era la cabecera y
// `<div id="root"></div>`: 4 KB sin una sola palabra del catálogo. Los robots
// que dibujan la vista previa de un enlace ya tenían lo suyo con el meta
// cocinado, pero los que RESPONDEN preguntas (Claude, ChatGPT, Perplexity) no
// ejecutan JavaScript: entraban en `/languages/python` y no encontraban ni el
// nombre de Python. Google sí renderiza, pero tarde y con menos peso.
//
// No es cloaking, y la diferencia importa: esto dice exactamente lo mismo que
// ve una persona, sacado de los mismos archivos de `data/`. Si algún día dijera
// otra cosa, sería motivo de penalización y estaría bien merecida.
//
// Se escribe en un nodo aparte (`#pre`), no dentro de `#root`, y `main.jsx` lo
// borra justo antes de montar React. Aparece pintado mientras el bundle carga,
// que es mejor que la pantalla en blanco que había antes.

import { LANGUAGES } from '../data/languages.js'
import { RESOURCES } from '../data/resources.js'
import { CONCEPTS } from '../data/concepts.js'
import { COMPONENT_ITEMS, COMPONENT_GROUPS } from '../data/components.js'
import { SKILL_ITEMS } from '../data/skills.js'
import { CONSEJOS, CONSEJO_GRUPOS, trozosDe } from '../data/consejos.js'
import { rutaDe, slugClave, slugLenguaje } from './rutas.js'

const SECCIONES = ['languages', 'resources', 'concepts', 'components', 'skills', 'consejos']

const esc = (s) => String(s ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

const a = (href, texto) => `<a href="${esc(href)}">${esc(texto)}</a>`
const p = (texto) => (texto ? `<p>${esc(texto)}</p>` : '')
const ul = (lineas) => (lineas.length ? `<ul>${lineas.map((l) => `<li>${l}</li>`).join('')}</ul>` : '')
const nota = (texto) => (texto ? ` <span class="sec">${esc(texto)}</span>` : '')

// Los campos largos de una ficha vienen unas veces como lista y otras como
// frase suelta. Se pinta lo que haya en vez de asumir una forma.
const bloque = (titulo, valor) => {
  if (!valor || (Array.isArray(valor) && !valor.length)) return ''
  const cuerpo = Array.isArray(valor) ? ul(valor.map(esc)) : p(valor)
  return `<h2>${esc(titulo)}</h2>${cuerpo}`
}

// El texto de un consejo lleva **negrita** y `código`: se reutiliza el mismo
// troceador que usa la tarjeta en pantalla, para que digan lo mismo.
const consejoHtml = (texto) => trozosDe(texto).map((t) =>
  t.tipo === 'fuerte' ? `<b>${esc(t.texto)}</b>`
    : t.tipo === 'codigo' ? `<code>${esc(t.texto)}</code>`
    : esc(t.texto)).join('')

function cabecera(t, vista) {
  const enlaces = SECCIONES
    .filter((s) => s !== vista)
    .map((s) => a(rutaDe(s), t.nav[s]))
  return `<header>${a('/', 'Vibeset')}${ul(enlaces)}</header>`
}

const pie = () => `<footer>${a('https://github.com/Mun1to/Vibeset', 'Vibeset en GitHub')}</footer>`

// ---------------------------------------------------------------- las vistas

const home = (t, lang) => `
  <h1>Vibeset</h1>
  ${p(`${t.heroTitle1} ${t.heroTitle2}`)}
  ${p(t.heroSub)}
  ${ul([
    a(rutaDe('languages'), t.nav.languages) + nota(`${LANGUAGES.length} fichas. ${t.langsSub}`),
    a(rutaDe('resources'), t.nav.resources) + nota(`${RESOURCES.reduce((n, g) => n + g.items.length, 0)} recursos. ${t.resSub}`),
    a(rutaDe('concepts'), t.nav.concepts) + nota(`${CONCEPTS.reduce((n, g) => n + g.items.length, 0)} técnicas. ${t.conceptsSub}`),
    a(rutaDe('components'), t.nav.components) + nota(`${COMPONENT_ITEMS.length} componentes. ${t.compSub}`),
    a(rutaDe('skills'), t.nav.skills) + nota(`${SKILL_ITEMS.length} skills. ${t.skillsSub}`),
    a(rutaDe('consejos'), t.nav.consejos) + nota(`${CONSEJOS.length} consejos. ${t.consejosSub}`),
  ])}`

const listaLenguajes = (t, lang) => `
  <h1>${esc(t.gridTitle)}</h1>
  ${p(t.langsSub)}
  ${ul(LANGUAGES.map((l) =>
    a(rutaDe('languages', slugLenguaje(l.name)), l.name) + nota(l[lang]?.desc)))}`

const fichaLenguaje = (l, t, lang) => {
  const d = l[lang] ?? l.es
  return `
  <h1>${esc(l.name)}</h1>
  ${p(d.fullDesc || d.desc)}
  ${ul([
    l.creator ? `Creado por ${esc(l.creator)}` : '',
    l.year ? `Año ${esc(l.year)}` : '',
    d.paradigm ? `Paradigma: ${esc(d.paradigm)}` : '',
    l.extensions?.length ? `Extensiones: ${esc(l.extensions.join(', '))}` : '',
  ].filter(Boolean))}
  ${bloque('Para qué se usa', d.uses)}
  ${bloque('A favor', d.pros)}
  ${bloque('En contra', d.cons)}
  ${l.eco?.length ? bloque('Ecosistema', l.eco) : ''}
  ${l.example ? `<h2>Ejemplo</h2><pre><code>${esc(l.example)}</code></pre>` : ''}`
}

const listaRecursos = (t, lang) => `
  <h1>${esc(t.resTitle)}</h1>
  ${p(t.resSub)}
  ${RESOURCES.map((g) => `<h2>${esc(g.label[lang])}</h2>${ul(g.items.map((i) =>
    a(i.url, i.name) + nota(i[lang])))}`).join('')}`

const listaConceptos = (t, lang) => `
  <h1>${esc(t.conceptsTitle)}</h1>
  ${p(t.conceptsSub)}
  ${CONCEPTS.map((g) => `<h2>${esc(g.label[lang])}</h2>${ul(g.items.map((i) => {
    const d = i[lang] ?? i.es
    return `<b>${esc(i.name)}</b>${nota(i.tag)}${d?.what ? ` ${esc(d.what)}` : ''}${d?.use ? ` ${esc(d.use)}` : ''}`
  }))}`).join('')}`

const listaComponentes = (t, lang) => `
  <h1>${esc(t.compTitle)}</h1>
  ${p(t.compSub)}
  ${COMPONENT_GROUPS.map((g) => {
    const items = COMPONENT_ITEMS.filter((c) => c.group === g.key)
    if (!items.length) return ''
    return `<h2>${esc(g.label[lang])}</h2>${ul(items.map((c) =>
      a(rutaDe('components', slugClave(c.key)), c.name) + nota(c.tag?.[lang])))}`
  }).join('')}`

const fichaComponente = (c, t, lang) => `
  <h1>${esc(c.name)}</h1>
  ${p(c.desc?.[lang])}
  ${ul([
    c.labels?.length ? esc(c.labels.join(', ')) : '',
    c.url ? a(c.url, 'Documentación original') : '',
  ].filter(Boolean))}
  ${c.install ? `<h2>Instalación</h2><pre><code>${esc(c.install)}</code></pre>` : ''}`

const listaSkills = (t, lang) => `
  <h1>${esc(t.skillsTitle)}</h1>
  ${p(t.skillsSub)}
  ${ul(SKILL_ITEMS.map((s) =>
    a(rutaDe('skills', slugClave(s.key)), s[lang]?.label ?? s.name) + nota(s[lang]?.what)))}`

const fichaSkill = (s, t, lang) => {
  const d = s[lang] ?? s.es
  return `
  <h1>${esc(d.label ?? s.name)}</h1>
  ${p(d.what)}
  ${bloque('Cuándo se usa', d.when)}
  ${d.body ? `<h2>SKILL.md</h2><pre><code>${esc(d.body)}</code></pre>` : ''}`
}

const listaConsejos = (t, lang) => `
  <h1>${esc(t.consejosTitle)} (${esc(t.beta)})</h1>
  ${p(t.consejosSub)}
  ${CONSEJO_GRUPOS.map((g) => {
    const items = CONSEJOS.filter((c) => c.grupo === g.key)
    if (!items.length) return ''
    return `<h2>${esc(g.label[lang])}</h2>${ul(items.map((c) =>
      consejoHtml(c[lang] ?? c.es) + (c.autor ? nota(`@${c.autor}`) : '')))}`
  }).join('')}`

const noHay = (t) => `<h1>${esc(t.noHayTitulo)}</h1>${p(t.noHayTexto)}`

// ------------------------------------------------------------------- público

// El HTML que se cocina dentro de `<div id="pre">` para una dirección.
export function contenidoDePagina({ vista, ficha, lang, t }) {
  const cuerpo =
    vista === '404' ? noHay(t)
    : vista === 'home' ? home(t, lang)
    : vista === 'languages' ? (ficha ? fichaLenguaje(ficha, t, lang) : listaLenguajes(t, lang))
    : vista === 'components' ? (ficha ? fichaComponente(ficha, t, lang) : listaComponentes(t, lang))
    : vista === 'skills' ? (ficha ? fichaSkill(ficha, t, lang) : listaSkills(t, lang))
    : vista === 'resources' ? listaRecursos(t, lang)
    : vista === 'concepts' ? listaConceptos(t, lang)
    : vista === 'consejos' ? listaConsejos(t, lang)
    : home(t, lang)

  return `${cabecera(t, vista)}<main>${cuerpo}</main>${pie()}`
}

// Los datos estructurados de una dirección, ya en JSON.
//
// Se queda corto a propósito: solo se declara lo que de verdad se ve en la
// página. Marcar de más es motivo de penalización, y aquí no hay ni precios ni
// valoraciones ni artículos que fingir.
export function jsonLdDePagina({ vista, ficha, lang, t, base, url, titulo, descripcion }) {
  const organizacion = {
    '@type': 'Organization',
    '@id': `${base}/#organizacion`,
    name: 'Vibeset',
    url: base,
    logo: `${base}/brand/og.png`,
    sameAs: ['https://github.com/Mun1to/Vibeset'],
  }

  if (vista === 'home') {
    return [organizacion, {
      '@type': 'WebSite',
      '@id': `${base}/#sitio`,
      name: 'Vibeset',
      url: base,
      description: descripcion,
      inLanguage: lang === 'en' ? 'en' : 'es',
      publisher: { '@id': `${base}/#organizacion` },
    }]
  }

  const migas = [{ '@type': 'ListItem', position: 1, name: 'Vibeset', item: base }]
  if (vista !== '404') {
    migas.push({ '@type': 'ListItem', position: 2, name: t.nav[vista] ?? vista, item: base + rutaDe(vista) })
    if (ficha) migas.push({ '@type': 'ListItem', position: 3, name: titulo.split(' · ')[0], item: url })
  }

  const nodos = [{ '@type': 'BreadcrumbList', itemListElement: migas }]

  // En una sección sin fichas propias, la lista es la página entera: se declara
  // cuántas cosas hay, que es justo lo que se enseña.
  if (!ficha && vista !== '404') {
    const cuantos = {
      languages: LANGUAGES.length,
      resources: RESOURCES.reduce((n, g) => n + g.items.length, 0),
      concepts: CONCEPTS.reduce((n, g) => n + g.items.length, 0),
      components: COMPONENT_ITEMS.length,
      skills: SKILL_ITEMS.length,
      consejos: CONSEJOS.length,
    }[vista]

    if (cuantos) {
      nodos.push({
        '@type': 'CollectionPage',
        name: titulo,
        description: descripcion,
        url,
        inLanguage: lang === 'en' ? 'en' : 'es',
        isPartOf: { '@id': `${base}/#sitio` },
        mainEntity: { '@type': 'ItemList', numberOfItems: cuantos },
      })
    }
  }

  return nodos
}
