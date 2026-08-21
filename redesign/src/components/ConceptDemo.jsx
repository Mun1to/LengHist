import { useCallback, useEffect, useRef, useState } from 'react'
import './conceptDemos/demos.css'

// Cada concepto tiene su demo en vivo. Se cargan por grupo y solo cuando la
// tarjeta se acerca a la pantalla: 41 demos montadas a la vez hundirían la
// página, y casi ninguna se está mirando en un momento dado.

const CARGADORES = {
  scroll: () => import('./conceptDemos/scroll'),
  pointer: () => import('./conceptDemos/pointer'),
  visual: () => import('./conceptDemos/visual'),
  perf: () => import('./conceptDemos/perf'),
  cssmod: () => import('./conceptDemos/cssmod'),
}

// Qué grupo trae cada concepto. Se mantiene aquí para saber si hay demo sin
// tener que descargar el módulo primero.
export const DEMO_GRUPO = {
  'Smooth scroll': 'scroll',
  Parallax: 'scroll',
  'Scroll Snap': 'scroll',
  'Scroll-driven animations': 'scroll',
  'Scroll reveal': 'scroll',
  'Sticky / Pin': 'scroll',
  'Horizontal scroll': 'scroll',
  Marquee: 'scroll',
  Scrollytelling: 'scroll',
  'Page transitions': 'scroll',

  'Tilt 3D': 'pointer',
  'Hover magnético': 'pointer',
  'Cursor personalizado (lerp)': 'pointer',
  'Micro-interacciones': 'pointer',
  'Cursor blend': 'pointer',
  'Spotlight / glow': 'pointer',

  Glassmorphism: 'visual',
  Neumorphism: 'visual',
  'Aurora / mesh gradient': 'visual',
  'Clip-path y máscaras': 'visual',
  'View Transitions': 'visual',
  'Skeleton loaders': 'visual',
  'Tipografía cinética': 'visual',
  'Noise / grain': 'visual',
  Preloader: 'visual',

  'Animar transform/opacity': 'perf',
  'will-change': 'perf',
  'Core Web Vitals': 'perf',
  'prefers-reduced-motion': 'perf',
  'Progressive enhancement': 'perf',
  'Responsive / mobile-first': 'perf',
  'Lazy loading': 'perf',
  'Debounce y throttle': 'perf',
  requestAnimationFrame: 'perf',

  'Container queries': 'cssmod',
  'Fluid typography': 'cssmod',
  ':has()': 'cssmod',
  'Cascade layers': 'cssmod',
  'color-mix()': 'cssmod',
  Subgrid: 'cssmod',
  'Logical properties': 'cssmod',
}

// Cada módulo se descarga una vez y se reparte entre todas las tarjetas del grupo.
const cache = new Map()
function cargarGrupo(grupo) {
  if (!cache.has(grupo)) cache.set(grupo, CARGADORES[grupo]())
  return cache.get(grupo)
}

export default function ConceptDemo({ nombre, etiqueta, lang }) {
  const grupo = DEMO_GRUPO[nombre]
  const vigia = useRef(null)
  const [Demo, setDemo] = useState(null)
  const [cerca, setCerca] = useState(false)

  // El nodo se observa con un ref de FUNCIÓN, no desde un efecto, y la
  // diferencia no es de estilo.
  //
  // Con el efecto, el observador se creaba sobre el nodo que hubiera en ese
  // momento; si React reemplazaba ese nodo después, el observador se quedaba
  // mirando un elemento suelto, fuera ya del documento, que por definición no
  // entra en pantalla nunca. Resultado: una demo que no arrancaba jamás.
  //
  // **Medido, no supuesto.** Entrando en `/concepts?q=marquee`, la única ficha
  // que queda a la vista se quedaba con su caja vacía para siempre, ni con
  // scroll ni esperando; y un observador nuevo creado a mano sobre ESE MISMO
  // nodo sí lo veía al instante. Ese es el retrato de un nodo huérfano. El caso
  // llega cuando la lista se filtra justo después del primer pintado, que es lo
  // que pasa al abrir una ficha desde el buscador.
  //
  // Con el ref de función no hay hueco posible: React llama a esto con el nodo
  // real en cuanto lo engancha, y con `null` al soltarlo.
  const observar = useCallback((el) => {
    vigia.current?.disconnect()
    vigia.current = null
    if (!el || !grupo) return

    // Si al engancharse ya está a la vista, no hay nada que esperar. Este atajo
    // es además el que salva el caso de arriba aunque el observador fallara.
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight + 260 && r.bottom > -260) { setCerca(true); return }

    vigia.current = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      setCerca(true)
      vigia.current?.disconnect()
      vigia.current = null
    }, { rootMargin: '260px' })
    vigia.current.observe(el)
  }, [grupo])

  useEffect(() => () => vigia.current?.disconnect(), [])

  useEffect(() => {
    if (!cerca || !grupo) return
    let vivo = true
    cargarGrupo(grupo).then((m) => { if (vivo) setDemo(() => m.DEMOS[nombre] ?? null) })
    return () => { vivo = false }
  }, [cerca, grupo, nombre])

  if (!grupo) return null

  return (
    <div className="mt-3">
      <div className="font-mono text-[12px] uppercase tracking-wider text-tinta-suave mb-1.5">{etiqueta}</div>
      {/* `data-demo` marca dónde acaba la interfaz de Vibeset y empieza el
          contenido del catálogo. Lo que hay dentro es la pieza que se enseña,
          con sus pistas a 9px y sus colores propios, y exigirle los suelos de
          la casa da fallos que no se pueden arreglar sin romper la demo. Faltaba
          aquí, así que las pistas de las demos de scroll y de puntero salían en
          la auditoría como si fueran texto nuestro. La etiqueta «demo» de arriba
          se queda fuera de la marca a propósito: esa sí es interfaz. */}
      <div ref={observar} data-demo>
        {Demo ? <Demo lang={lang} /> : <div className="cd-box" />}
      </div>
    </div>
  )
}
