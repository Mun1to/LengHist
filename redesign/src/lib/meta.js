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
