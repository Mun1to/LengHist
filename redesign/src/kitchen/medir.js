// Las medidas del kitchen sink, calculadas del navegador y nunca escritas a mano.
//
// La razón es la misma por la que existe `lib/totales.js`: un muestrario que
// repite los valores del sistema en una lista propia se desincroniza el primer
// día que alguien cambia un token, y entonces enseña un sistema que ya no es el
// de la web. Aquí no hay ninguna tabla de colores: se pregunta al navegador qué
// vale cada variable y qué contraste da, y lo que se pinta es su respuesta.

// Un canvas de 1x1 es el único conversor de color fiable, y esto ya costó una
// auditoría entera: Tailwind v4 emite `oklch()`, así que sacar los números con
// una expresión regular devuelve luminosidad y grados como si fueran rojo y
// verde. El navegador, en cambio, sabe traducir cualquier sintaxis de color que
// entienda, incluidas las que aún no existen.
let pincel = null
export function aRgb(color) {
  if (!pincel) {
    const c = document.createElement('canvas')
    c.width = c.height = 1
    pincel = c.getContext('2d', { willReadFrequently: true })
  }
  pincel.clearRect(0, 0, 1, 1)
  pincel.fillStyle = '#000'
  pincel.fillStyle = color
  pincel.fillRect(0, 0, 1, 1)
  const [r, g, b, a] = pincel.getImageData(0, 0, 1, 1).data
  return { r, g, b, a: a / 255 }
}

const canal = (v) => {
  const s = v / 255
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

export const luminancia = ({ r, g, b }) =>
  0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b)

// El contraste de la WCAG, con un decimal. 4,5 es el aprobado para texto normal
// y 3 para texto grande y para los bordes de un control.
export function contraste(colorA, colorB) {
  const a = luminancia(aRgb(colorA))
  const b = luminancia(aRgb(colorB))
  const [alto, bajo] = a > b ? [a, b] : [b, a]
  return Math.round(((alto + 0.05) / (bajo + 0.05)) * 100) / 100
}

// El fondo de verdad que hay detrás de un elemento. Un elemento casi nunca
// declara el suyo: hereda el del padre, o el del abuelo, y para medir el
// contraste hace falta el primer ancestro que pinte algo opaco.
// OJO con el documento: cuando esto audita una ruta dentro de un iframe, los
// estilos hay que pedírselos a la ventana del IFRAME. La primera versión remataba
// la subida con `document.documentElement` del padre, así que un texto claro de
// una página en oscuro se comparaba contra el fondo claro del kitchen sink y
// salía 1:1. Fueron 523 fallos inventados de golpe, y la pista de que eran
// falsos es justo ese 1:1: dos colores idénticos no ocurren en una web que se ve.
export function fondoReal(el) {
  const doc = el.ownerDocument ?? document
  const ventana = doc.defaultView ?? window
  let n = el
  while (n && n !== doc.documentElement) {
    const { backgroundColor } = ventana.getComputedStyle(n)
    const { a } = aRgb(backgroundColor)
    if (a > 0.95) return backgroundColor
    n = n.parentElement
  }
  const raiz = ventana.getComputedStyle(doc.documentElement).backgroundColor
  return aRgb(raiz).a > 0.95 ? raiz : '#fff'
}

// El valor de una variable del tema, resuelto. `getPropertyValue` devuelve lo
// que está escrito, que puede ser otro `var(...)`, así que se pinta en un
// elemento de usar y tirar y se lee ya calculado.
export function tokenResuelto(nombre) {
  const sonda = document.createElement('span')
  sonda.style.cssText = `position:absolute;visibility:hidden;color:var(${nombre})`
  document.body.appendChild(sonda)
  const valor = getComputedStyle(sonda).color
  sonda.remove()
  return valor
}

// Recorre un árbol y devuelve lo que incumple los suelos de la casa. Se usa
// sobre la propia página y sobre las rutas reales cargadas en un iframe, así que
// mide la web de verdad y no una maqueta que se le parece.
export function auditar(raiz) {
  const doc = raiz.ownerDocument ?? document
  const fallos = { contraste: [], tactil: [], letraMinuscula: [], colorEnNavegacion: [] }
  const nombre = (el) => (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 34) || `<${el.tagName.toLowerCase()}>`

  // Lo que hay DENTRO de una demo del catálogo no es interfaz de Vibeset: es la
  // pieza que se está enseñando. La rejilla de lenguajes que dibuja un efecto a
  // 9px es el contenido del ejemplo, y exigirle los suelos de la casa da 50
  // fallos que no se pueden arreglar sin romper la demo. Se excluye a propósito
  // y con nombre, que es distinto de no mirarlo.
  const ES_DEMO = '[data-demo], canvas, .cd-demo, .cd-card, .ventana-codigo, [data-superficie]'

  for (const el of raiz.querySelectorAll('*')) {
    // Lo decorativo lo exceptúa la propia norma: si un lector de pantalla no lo
    // anuncia, tampoco hay que exigirle contraste de texto.
    if (el.closest('[aria-hidden="true"]')) continue
    if (el.closest(ES_DEMO)) continue
    const cs = doc.defaultView.getComputedStyle(el)
    if (cs.visibility === 'hidden' || cs.display === 'none') continue

    const texto = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
    if (texto) {
      const px = parseFloat(cs.fontSize)
      const grande = px >= 24 || (px >= 18.66 && Number(cs.fontWeight) >= 700)
      const c = contraste(cs.color, fondoReal(el))
      if (c < (grande ? 3 : 4.5)) fallos.contraste.push({ que: nombre(el), valor: c, px })
      // El 11px monoespaciado es la firma de la casa y se queda; por debajo, no.
      if (px < 11) fallos.letraMinuscula.push({ que: nombre(el), px })
    }

    if (el.matches('a, button, input, select, [role="button"]')) {
      // El enlace de saltar al contenido está oculto hasta recibir el foco: mide
      // cero por diseño y no es un objetivo pequeño.
      if (el.classList.contains('sr-only')) continue
      const r = el.getBoundingClientRect()
      // El suelo son 24 CSS px, pero se compara con una décima de margen y se
      // informa con un decimal: un control con `min-h-6` mide 23,99 en algunos
      // anchos por el redondeo del motor de maquetación, y marcarlo en rojo
      // manda a perseguir una centésima que no ve nadie. Lo que sí hay que ver
      // es un 16,5, que es un objetivo pequeño de verdad.
      const corto = (v) => Math.round(v * 10) / 10
      if (r.width > 0 && (r.width < 23.9 || r.height < 23.9)) {
        fallos.tactil.push({ que: nombre(el), w: corto(r.width), h: corto(r.height) })
      }
    }
  }

  // La regla que Munir ha pedido tres veces: en una lista de navegación no entra
  // el color. Aquí «color» significa cualquier cosa que no sea gris puro, y por
  // eso se mide la distancia entre canales en vez de buscar nombres de clase.
  for (const zona of raiz.querySelectorAll('header nav, aside, [data-nav]')) {
    for (const el of zona.querySelectorAll('a, button, span, div')) {
      if (el.closest('[aria-hidden="true"], svg')) continue
      const cs = doc.defaultView.getComputedStyle(el)
      for (const prop of ['color', 'backgroundColor', 'borderLeftColor']) {
        const { r, g, b, a } = aRgb(cs[prop])
        if (a < 0.12) continue
        if (Math.max(r, g, b) - Math.min(r, g, b) > 26) {
          fallos.colorEnNavegacion.push({ que: nombre(el), prop, valor: cs[prop] })
        }
      }
    }
  }

  return fallos
}
