import { IDIOMAS, traducirRuta } from './rutas.js'

// Qué idioma prefiere quien llega. No decide lo que se pinta, que eso lo dice la
// dirección desde que el inglés vive en `/en`: decide si a alguien que entra por
// una dirección española hay que llevarlo a la inglesa.
//
// El orden manda lo que haya elegido a mano; si nunca eligió, lo que pida su
// navegador; y si tampoco encaja, español.
const CLAVE = 'vibeset-lang'

export function idiomaPreferido() {
  try {
    const guardado = localStorage.getItem(CLAVE)
    if (IDIOMAS.includes(guardado)) return guardado
  } catch { /* navegación privada sin almacenamiento */ }

  const preferidos = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const etiqueta of preferidos ?? []) {
    // 'en-GB' y 'en' valen los dos: interesa la parte de antes del guion.
    const base = String(etiqueta).toLowerCase().split('-')[0]
    if (IDIOMAS.includes(base)) return base
  }
  return 'es'
}

export function guardarIdioma(lang) {
  try { localStorage.setItem(CLAVE, lang) } catch { /* sin almacenamiento */ }
}

// Lleva a la dirección inglesa a quien entra por una española con el navegador
// en inglés y nunca ha elegido idioma. Se llama ANTES de montar React, y ese
// detalle es la mitad del asunto: hecho dentro de un efecto, la página se pinta
// una vez en español y cambia medio segundo después, que se ve y se lee como un
// fallo. Aquí el router arranca ya con la dirección buena.
//
// Tres cosas que no son casualidad:
//
// - Usa `replaceState`, así que no deja escalón en el historial y el botón atrás
//   sigue llevando de donde vino. Redirigir por idioma dejando una entrada nueva
//   es lo que rompe el «atrás», y es la razón por la que Google desaconseja esas
//   redirecciones.
// - Solo va en el sentido español → inglés. Las direcciones de `/en` son
//   explícitas: quien comparte una está eligiendo, y eso se respeta siempre.
// - No la ve ningún buscador, porque los rastreadores no ejecutan JavaScript.
//   Ellos ven el HTML español en `/` y el inglés en `/en`, cada uno con su
//   canonical y sus `hreflang`, que es exactamente lo que hay que enseñarles.
export function ajustarDireccionAlIdioma() {
  const { pathname, search, hash } = window.location
  if (pathname === '/en' || pathname.startsWith('/en/')) return
  if (idiomaPreferido() !== 'en') return

  const destino = traducirRuta(pathname, 'en')
  if (destino === pathname) return
  window.history.replaceState(null, '', destino + search + hash)
}
