import { useEffect } from 'react'

// Con una sola URL, el título y la descripción de la pestaña valían para todo el
// sitio. Ahora que cada ficha tiene la suya, cada una dice lo suyo: es lo que se
// ve en la pestaña, en el historial, en el resultado de Google y en la tarjeta
// que sale al pegar el enlace en un chat.
const BASE = 'https://vibeset.dev'

function fijarMeta(selector, atributo, valor) {
  const el = document.head.querySelector(selector)
  if (el) el.setAttribute(atributo, valor)
}

export function useMeta({ titulo, descripcion, ruta }) {
  useEffect(() => {
    document.title = titulo
    fijarMeta('meta[name="description"]', 'content', descripcion)
    fijarMeta('meta[property="og:title"]', 'content', titulo)
    fijarMeta('meta[property="og:description"]', 'content', descripcion)
    fijarMeta('meta[name="twitter:title"]', 'content', titulo)
    fijarMeta('meta[name="twitter:description"]', 'content', descripcion)
    fijarMeta('meta[property="og:url"]', 'content', BASE + ruta)
    fijarMeta('link[rel="canonical"]', 'href', BASE + ruta)
  }, [titulo, descripcion, ruta])
}

// Corta por la última palabra entera: una descripción cortada a mitad de palabra
// en un resultado de búsqueda queda peor que una frase más corta.
export function recortar(texto, max = 155) {
  if (!texto || texto.length <= max) return texto ?? ''
  const trozo = texto.slice(0, max)
  return trozo.slice(0, trozo.lastIndexOf(' ')) + '…'
}

// El título y la descripción de una página, calculados sin tocar el navegador.
//
// Vive aquí y no dentro de App porque hacen falta en DOS sitios: la aplicación
// los pone al navegar, y el build los escribe dentro del HTML de cada dirección
// (`prerenderMeta` en vite.config.js). Los robots que dibujan la vista previa de
// un enlace (X, Slack, LinkedIn, WhatsApp, Discord) NO ejecutan JavaScript: si
// esto solo lo hiciera React, las 136 direcciones compartirían tarjeta.
//
// `ficha` es la entrada ya resuelta cuando la ruta apunta a una: el lenguaje, el
// componente o la skill. Sin ella, la vista es una sección entera.
export function metaDePagina({ vista, ficha, lang, t }) {
  const marca = 'Vibeset'

  if (vista === '404') return { titulo: `${t.noHayTitulo} · ${marca}`, descripcion: t.noHayTexto }
  if (vista === 'home') {
    return { titulo: `${marca} · ${t.heroTitle1} ${t.heroTitle2}`, descripcion: recortar(t.heroSub) }
  }

  if (ficha) {
    if (vista === 'languages') return { titulo: `${ficha.name} · ${marca}`, descripcion: recortar(ficha[lang].fullDesc) }
    if (vista === 'components') return { titulo: `${ficha.name} · ${marca}`, descripcion: recortar(ficha.desc[lang]) }
    if (vista === 'skills') return { titulo: `${ficha[lang].label} · ${marca}`, descripcion: recortar(ficha[lang].what) }
  }

  const titulos = {
    languages: [t.gridTitle, t.langsSub], resources: [t.resTitle, t.resSub],
    concepts: [t.conceptsTitle, t.conceptsSub], components: [t.compTitle, t.compSub],
    skills: [t.skillsTitle, t.skillsSub], consejos: [t.consejosTitle, t.consejosSub],
  }
  const [titulo, sub] = titulos[vista] ?? [marca, t.heroSub]
  // «Componentes de Vibeset» ya lleva la marca dentro: añadirla otra vez dejaba
  // «Componentes de Vibeset · Vibeset» en la pestaña y en el buscador.
  const conMarca = titulo.includes(marca) ? titulo : `${titulo} · ${marca}`
  return { titulo: conMarca, descripcion: recortar(sub) }
}
