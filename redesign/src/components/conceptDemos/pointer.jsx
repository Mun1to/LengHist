import { useEffect, useRef, useState } from 'react'
import { textoDe } from './texto'

// Demos del grupo "Puntero y micro-interacciones". Todas usan pointer events,
// así que funcionan igual con ratón y con el dedo.

// Posición del puntero dentro de la caja, en 0..1. Se escribe con rAF.
function usePuntero(ref, alSalir = { x: 0.5, y: 0.5 }) {
  const [pos, setPos] = useState(alSalir)
  const [dentro, setDentro] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    let ultima = alSalir
    const escribir = () => { raf = 0; setPos(ultima) }
    const pedir = () => { if (!raf) raf = requestAnimationFrame(escribir) }
    const mover = (e) => {
      const r = el.getBoundingClientRect()
      ultima = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }
      pedir()
    }
    const entrar = () => setDentro(true)
    const salir = () => { setDentro(false); ultima = alSalir; pedir() }
    el.addEventListener('pointermove', mover, { passive: true })
    el.addEventListener('pointerenter', entrar)
    el.addEventListener('pointerleave', salir)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', mover)
      el.removeEventListener('pointerenter', entrar)
      el.removeEventListener('pointerleave', salir)
    }
  }, [ref])

  return [pos, dentro]
}

export function Tilt3D({ lang }) {
  const t = textoDe(lang)
  const ref = useRef(null)
  const [{ x, y }, dentro] = usePuntero(ref)
  return (
    <div ref={ref} className="cd-box grid place-items-center" style={{ perspective: '700px' }}>
      <div
        className="cd-tilt cd-card w-[130px] h-[86px] grid place-items-center font-bold text-indigo-300"
        style={{
          transform: `rotateY(${(x - 0.5) * 26}deg) rotateX(${-(y - 0.5) * 26}deg) scale(${dentro ? 1.05 : 1})`,
          boxShadow: dentro ? '0 14px 30px rgba(0,0,0,.5)' : 'none',
        }}
      >
        3D
      </div>
      <span className="cd-hint">{t.mueveCursor}</span>
    </div>
  )
}

export function HoverMagnetico({ lang }) {
  const t = textoDe(lang)
  const ref = useRef(null)
  const botonRef = useRef(null)
  const [d, setD] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const caja = ref.current
    const boton = botonRef.current
    if (!caja || !boton) return
    let raf = 0
    let dest = { x: 0, y: 0 }
    const escribir = () => { raf = 0; setD(dest) }
    const pedir = () => { if (!raf) raf = requestAnimationFrame(escribir) }
    const mover = (e) => {
      const r = boton.getBoundingClientRect()
      const dx = e.clientX - r.left - r.width / 2
      const dy = e.clientY - r.top - r.height / 2
      // Solo tira cuando el cursor está cerca: si no, el botón persigue siempre.
      const fuerza = Math.hypot(dx, dy) < 110 ? 0.32 : 0
      dest = { x: dx * fuerza, y: dy * fuerza }
      pedir()
    }
    const salir = () => { dest = { x: 0, y: 0 }; pedir() }
    caja.addEventListener('pointermove', mover, { passive: true })
    caja.addEventListener('pointerleave', salir)
    return () => {
      cancelAnimationFrame(raf)
      caja.removeEventListener('pointermove', mover)
      caja.removeEventListener('pointerleave', salir)
    }
  }, [])

  return (
    <div ref={ref} className="cd-box grid place-items-center">
      <div
        ref={botonRef}
        className="cd-magnet cd-card px-5 py-2.5 font-bold text-indigo-300"
        style={{ translate: `${d.x}px ${d.y}px` }}
      >
        {t.acercate}
      </div>
      <span className="cd-hint">{t.botonTeBusca}</span>
    </div>
  )
}

export function CursorLerp({ lang }) {
  const t = textoDe(lang)
  const ref = useRef(null)
  const puntoRef = useRef(null)
  const estelaRef = useRef(null)

  useEffect(() => {
    const caja = ref.current
    const punto = puntoRef.current
    const estela = estelaRef.current
    if (!caja || !punto || !estela) return
    let raf = 0
    let mx = 0, my = 0, ex = 0, ey = 0, vivo = false

    const mover = (e) => {
      const r = caja.getBoundingClientRect()
      mx = e.clientX - r.left
      my = e.clientY - r.top
      punto.style.transform = `translate(${mx - 11}px, ${my - 11}px)`
      if (!vivo) { vivo = true; punto.style.opacity = estela.style.opacity = '1' }
    }
    const bucle = () => {
      ex += (mx - ex) * 0.12   // persigue sin llegar nunca del todo
      ey += (my - ey) * 0.12
      estela.style.transform = `translate(${ex - 17}px, ${ey - 17}px)`
      raf = requestAnimationFrame(bucle)
    }
    const salir = () => { vivo = false; punto.style.opacity = estela.style.opacity = '0' }
    caja.addEventListener('pointermove', mover, { passive: true })
    caja.addEventListener('pointerleave', salir)
    raf = requestAnimationFrame(bucle)
    return () => {
      cancelAnimationFrame(raf)
      caja.removeEventListener('pointermove', mover)
      caja.removeEventListener('pointerleave', salir)
    }
  }, [])

  return (
    <div ref={ref} className="cd-box grid place-items-center cursor-none">
      <span className="font-mono text-[11px] text-zinc-400">{t.circuloTarde}</span>
      <div ref={estelaRef} className="cd-dot" style={{ width: 34, height: 34, border: '1px solid #818cf8', opacity: 0 }} />
      <div ref={puntoRef} className="cd-dot" style={{ background: '#818cf8', opacity: 0 }} />
    </div>
  )
}

export function MicroInteracciones({ lang }) {
  const t = textoDe(lang)
  const [me, setMe] = useState(false)
  return (
    <div className="cd-box grid place-items-center gap-3">
      <button
        className="cd-micro cd-card px-4 py-2 font-bold text-indigo-300"
        onClick={() => setMe((v) => !v)}
        style={me ? { background: '#4f46e5', color: '#fff', borderColor: '#4f46e5' } : undefined}
      >
        {me ? t.meGustaOk : t.meGusta}
      </button>
      <span className="cd-nota">{t.hoverPulsaSuelta}</span>
    </div>
  )
}

export function CursorBlend({ lang }) {
  const t = textoDe(lang)
  const ref = useRef(null)
  const [{ x, y }, dentro] = usePuntero(ref)
  return (
    <div ref={ref} className="cd-box grid place-items-center overflow-hidden cursor-none" style={{ background: '#e4e4e7' }}>
      <div className="font-extrabold text-2xl tracking-tight" style={{ color: '#09090b' }}>{t.invertido}</div>
      {/* left/top en % van sobre la caja; el % de translate iba sobre el propio
          círculo, así que se movía 54px como mucho y no salía de la esquina */}
      <div
        className="cd-dot cd-blend"
        style={{ width: 54, height: 54,
                 left: `${x * 100}%`, top: `${y * 100}%`,
                 transform: 'translate(-50%, -50%)',
                 opacity: dentro ? 1 : 0.35,
                 transition: 'opacity .2s' }}
      />
      <span className="cd-hint" style={{ color: '#52525b', textShadow: 'none' }}>{t.pasaleEncima}</span>
    </div>
  )
}

export function Spotlight({ lang }) {
  const t = textoDe(lang)
  const ref = useRef(null)
  const [{ x, y }, dentro] = usePuntero(ref)
  return (
    <div ref={ref} className="cd-box grid place-items-center">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(180px circle at ${x * 100}% ${y * 100}%, rgba(99,102,241,.42), transparent 65%)`,
          opacity: dentro ? 1 : 0.5,
          transition: 'opacity .25s',
        }}
      />
      <div className="cd-card relative px-5 py-3 font-bold text-indigo-200">{t.luzTeSigue}</div>
      <span className="cd-hint">{t.mueveCursor}</span>
    </div>
  )
}

export const DEMOS = {
  'Tilt 3D': Tilt3D,
  'Hover magnético': HoverMagnetico,
  'Cursor personalizado (lerp)': CursorLerp,
  'Micro-interacciones': MicroInteracciones,
  'Cursor blend': CursorBlend,
  'Spotlight / glow': Spotlight,
}
