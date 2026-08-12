import { useEffect, useRef, useState } from 'react'
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
  const ref = useRef(null)
  const [Demo, setDemo] = useState(null)
  const [cerca, setCerca] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !grupo) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setCerca(true); io.disconnect() } },
      { rootMargin: '260px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [grupo])

  useEffect(() => {
    if (!cerca || !grupo) return
    let vivo = true
    cargarGrupo(grupo).then((m) => { if (vivo) setDemo(() => m.DEMOS[nombre] ?? null) })
    return () => { vivo = false }
  }, [cerca, grupo, nombre])

  if (!grupo) return null

  return (
    <div className="mt-3">
      <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5">{etiqueta}</div>
      <div ref={ref}>
        {Demo ? <Demo lang={lang} /> : <div className="cd-box" />}
      </div>
    </div>
  )
}
