import { useEffect, useRef, useState } from 'react'
import { textoDe } from './texto'

// Demos del grupo "Rendimiento y buenas prácticas". Varias miden de verdad
// sobre el navegador de quien mira: no son maquetas.

// Fotogramas por segundo reales, medidos con rAF.
function useFps(activo = true) {
  const [fps, setFps] = useState(0)
  useEffect(() => {
    if (!activo) return
    let raf = 0, cuadros = 0, desde = performance.now()
    const bucle = (t) => {
      cuadros++
      if (t - desde >= 500) {
        setFps(Math.round((cuadros * 1000) / (t - desde)))
        cuadros = 0
        desde = t
      }
      raf = requestAnimationFrame(bucle)
    }
    raf = requestAnimationFrame(bucle)
    return () => cancelAnimationFrame(raf)
  }, [activo])
  return fps
}

export function AnimarTransform({ lang }) {
  const t = textoDe(lang)
  return (
    <div className="cd-box p-3 flex flex-col justify-center gap-4">
      <div>
        <div className="font-mono text-[10px] text-emerald-400 mb-1.5">{t.transformGpu}</div>
        <div className="cd-good w-8 h-5 rounded bg-emerald-500" />
      </div>
      <div>
        <div className="font-mono text-[10px] text-rose-400 mb-1.5">{t.marginRecalcula}</div>
        <div className="cd-bad w-8 h-5 rounded bg-rose-500" />
      </div>
      <div className="cd-nota">{t.mismoMovimiento}</div>
    </div>
  )
}

export function WillChange({ lang }) {
  const t = textoDe(lang)
  const [on, setOn] = useState(false)
  const [corriendo, setCorriendo] = useState(false)
  const fps = useFps(corriendo)

  useEffect(() => {
    if (!corriendo) return
    const id = setTimeout(() => setCorriendo(false), 2600)
    return () => clearTimeout(id)
  }, [corriendo])

  return (
    <div className="cd-box p-3 flex flex-col justify-between">
      <div className="flex flex-wrap gap-[3px]">
        {Array.from({ length: 60 }, (_, i) => (
          <div
            key={i}
            className="w-3.5 h-3.5 rounded-sm bg-blue-500"
            style={{
              willChange: on ? 'transform' : 'auto',
              transform: corriendo ? `rotate(${(i % 7) * 40}deg) scale(.7)` : 'none',
              transition: 'transform .9s ease-in-out',
            }}
          />
        ))}
      </div>
      <div className="flex items-center gap-3 mt-2">
        <button className="cd-btn" data-on={on} onClick={() => setOn((v) => !v)}>
          will-change: {on ? 'transform' : 'auto'}
        </button>
        <button className="cd-btn" onClick={() => setCorriendo(true)}>{t.animar}</button>
        <span className="font-mono text-[10px] text-zinc-400 ml-auto">{corriendo ? `${fps} fps` : ''}</span>
      </div>
    </div>
  )
}

export function CoreWebVitals({ lang }) {
  const t = textoDe(lang)
  const [m, setM] = useState({ lcp: null, cls: 0 })

  useEffect(() => {
    const obs = []
    try {
      const lcp = new PerformanceObserver((l) => {
        const ultima = l.getEntries().at(-1)
        if (ultima) setM((v) => ({ ...v, lcp: Math.round(ultima.startTime) }))
      })
      lcp.observe({ type: 'largest-contentful-paint', buffered: true })
      obs.push(lcp)

      const cls = new PerformanceObserver((l) => {
        let suma = 0
        for (const e of l.getEntries()) if (!e.hadRecentInput) suma += e.value
        if (suma) setM((v) => ({ ...v, cls: +(v.cls + suma).toFixed(4) }))
      })
      cls.observe({ type: 'layout-shift', buffered: true })
      obs.push(cls)
    } catch { /* navegador sin estas métricas */ }
    return () => obs.forEach((o) => o.disconnect())
  }, [])

  const bien = (v, limite) => (v == null ? 'text-zinc-400' : v <= limite ? 'text-emerald-400' : 'text-amber-400')

  return (
    <div className="cd-box p-3 flex flex-col justify-center gap-2.5">
      <div className="cd-nota">{t.medidoAhora}</div>
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-[11px] text-zinc-400 w-9">LCP</span>
        <span className={`font-mono text-lg font-bold ${bien(m.lcp, 2500)}`}>
          {m.lcp == null ? '—' : `${(m.lcp / 1000).toFixed(2)} s`}
        </span>
        <span className="cd-nota">{t.buenoLcp}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-[11px] text-zinc-400 w-9">CLS</span>
        <span className={`font-mono text-lg font-bold ${bien(m.cls, 0.1)}`}>{m.cls.toFixed(3)}</span>
        <span className="cd-nota">{t.buenoCls}</span>
      </div>
    </div>
  )
}

export function ReducedMotion({ lang }) {
  const t = textoDe(lang)
  const [reduce, setReduce] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const leer = () => setReduce(mq.matches)
    leer()
    mq.addEventListener('change', leer)
    return () => mq.removeEventListener('change', leer)
  }, [])

  return (
    <div className="cd-box grid place-items-center gap-3">
      {/* la pista acota el recorrido: centrado, la caja se le quedaba corta */}
      <div className="w-[150px]">
        <div
          className="w-12 h-12 rounded-xl bg-blue-500"
          style={{ animation: `cd-vaiven ${reduce ? '3.4s' : '1.4s'} ease-in-out infinite alternate`,
                   opacity: reduce ? 0.85 : 1 }}
        />
      </div>
      <div className="text-center">
        <div className="font-semibold text-zinc-200">{reduce ? t.pidesMenos : t.aceptasMovimiento}</div>
        <div className="cd-nota mt-0.5">{t.leidoSistema}</div>
      </div>
    </div>
  )
}

export function ProgressiveEnhancement({ lang }) {
  const t = textoDe(lang)
  const [soporte, setSoporte] = useState([])
  useEffect(() => {
    const prueba = [
      ['animation-timeline: view()', () => CSS.supports('animation-timeline', 'view()')],
      ['container queries', () => CSS.supports('container-type', 'inline-size')],
      [':has()', () => CSS.supports('selector(:has(*))')],
      ['View Transitions', () => !!document.startViewTransition],
      ['subgrid', () => CSS.supports('grid-template-rows', 'subgrid')],
    ]
    setSoporte(prueba.map(([n, f]) => { try { return [n, !!f()] } catch { return [n, false] } }))
  }, [])

  return (
    <div className="cd-box p-3 flex flex-col justify-center gap-1">
      <div className="cd-nota mb-1">{t.tuNavegadorTrae}</div>
      {soporte.map(([n, ok]) => (
        <div key={n} className="flex items-center gap-2 font-mono text-[10px]">
          <span className={ok ? 'text-emerald-400' : 'text-zinc-600'}>{ok ? '✓' : '·'}</span>
          <span className={ok ? 'text-zinc-300' : 'text-zinc-600'}>{n}</span>
        </div>
      ))}
      <div className="cd-nota mt-1">{t.seDegrada}</div>
    </div>
  )
}

export function MobileFirst({ lang }) {
  const t = textoDe(lang)
  const [ancho, setAncho] = useState(1)
  const anchos = [
    { n: t.movil, px: 150, cols: 1 },
    { n: t.tableta, px: 230, cols: 2 },
    { n: t.escritorio, px: 300, cols: 3 },
  ]
  const a = anchos[ancho]

  return (
    <div className="cd-box grid place-items-center gap-3">
      <div
        className="border border-zinc-700 rounded p-2 grid gap-1.5"
        style={{ width: a.px, gridTemplateColumns: `repeat(${a.cols}, 1fr)`, transition: 'width .3s ease' }}
      >
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-9 rounded bg-blue-500/70" />
        ))}
      </div>
      <div className="flex gap-3">
        {anchos.map((x, i) => (
          <button key={x.n} className="cd-btn" data-on={i === ancho} onClick={() => setAncho(i)}>{x.n}</button>
        ))}
      </div>
    </div>
  )
}

export function LazyLoading({ lang }) {
  const t = textoDe(lang)
  const [cargadas, setCargadas] = useState({})
  // La marca de tiempo evita que la caché sirva la imagen antes de tiempo.
  const sello = useRef(Math.floor(performance.timeOrigin))

  return (
    <div className="cd-box">
      <div className="cd-scroller p-2 flex flex-col gap-2">
        <div className="cd-nota">{t.bajaCadaFoto}</div>
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="relative h-[86px] rounded overflow-hidden bg-zinc-800 shrink-0">
            <img
              src={`/demo/paisaje-${n}.jpg?lazy=${sello.current}`}
              loading="lazy"
              decoding="async"
              width="320" height="86"
              alt=""
              className="w-full h-full object-cover"
              onLoad={() => setCargadas((c) => ({ ...c, [n]: true }))}
            />
            <span className="absolute left-1.5 bottom-1.5 font-mono text-[10px] px-1 text-white"
                  style={{ textShadow: '0 1px 6px #000' }}>
              {t.foto} {n} · {cargadas[n] ? t.cargada : t.esperando}
            </span>
          </div>
        ))}
      </div>
      <span className="cd-hint">{t.scroll}</span>
    </div>
  )
}

export function DebounceThrottle({ lang }) {
  const t = textoDe(lang)
  const [n, setN] = useState({ bruto: 0, deb: 0, thr: 0 })
  const tDeb = useRef(0)
  const tThr = useRef(0)

  const alEscribir = () => {
    setN((v) => ({ ...v, bruto: v.bruto + 1 }))
    clearTimeout(tDeb.current)
    tDeb.current = setTimeout(() => setN((v) => ({ ...v, deb: v.deb + 1 })), 400)
    const ahora = performance.now()
    if (ahora - tThr.current > 400) {
      tThr.current = ahora
      setN((v) => ({ ...v, thr: v.thr + 1 }))
    }
  }

  useEffect(() => () => clearTimeout(tDeb.current), [])

  return (
    <div className="cd-box p-3 flex flex-col justify-center gap-3">
      <input
        onChange={alEscribir}
        placeholder={t.escribeDeprisa}
        className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-100 outline-none focus:border-blue-500"
      />
      <div className="flex gap-4 font-mono text-[10px]">
        <span className="text-rose-400">{t.bruto} {n.bruto}</span>
        <span className="text-emerald-400">debounce {n.deb}</span>
        <span className="text-cyan-400">throttle {n.thr}</span>
      </div>
      <div className="cd-nota">{t.debounceThrottle}</div>
    </div>
  )
}

export function RequestAnimationFrame({ lang }) {
  const t = textoDe(lang)
  const fps = useFps(true)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const inicio = performance.now()
    const bucle = (t2) => {
      const s = (t2 - inicio) / 1000
      el.style.transform = `translateX(${Math.sin(s * 1.6) * 58}px)`
      raf = requestAnimationFrame(bucle)
    }
    raf = requestAnimationFrame(bucle)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="cd-box grid place-items-center gap-3">
      <div ref={ref} className="w-9 h-9 rounded-full bg-blue-500" />
      <div className="text-center">
        <div className="font-mono text-lg font-bold text-blue-300">{fps} fps</div>
        <div className="cd-nota">{t.unFotograma}</div>
      </div>
    </div>
  )
}

export const DEMOS = {
  'Animar transform/opacity': AnimarTransform,
  'will-change': WillChange,
  'Core Web Vitals': CoreWebVitals,
  'prefers-reduced-motion': ReducedMotion,
  'Progressive enhancement': ProgressiveEnhancement,
  'Responsive / mobile-first': MobileFirst,
  'Lazy loading': LazyLoading,
  'Debounce y throttle': DebounceThrottle,
  requestAnimationFrame: RequestAnimationFrame,
}
