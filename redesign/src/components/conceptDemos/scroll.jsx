import { useEffect, useRef, useState } from 'react'
import { textoDe } from './texto'

// Demos del grupo "Scroll interactivo". Cada una vive dentro de su caja y usa
// su propio scroll: ninguna toca el de la página.

const FOTO = '/demo/paisaje-2.jpg'

// Lee el scroll de la caja dentro de un rAF, que es lo que predica el concepto.
// Se puede apagar: hay una demo que solo lo necesita si el navegador no trae
// líneas de tiempo de scroll en CSS.
function useProgresoScroll(ref, activo = true) {
  const [p, setP] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el || !activo) return
    let raf = 0
    const leer = () => {
      raf = 0
      const max = el.scrollHeight - el.clientHeight
      setP(max > 0 ? el.scrollTop / max : 0)
    }
    const pedir = () => { if (!raf) raf = requestAnimationFrame(leer) }
    el.addEventListener('scroll', pedir, { passive: true })
    leer()
    return () => { cancelAnimationFrame(raf); el.removeEventListener('scroll', pedir) }
  }, [ref, activo])
  return p
}

// Arrastrar con el ratón una tira que solo se movía con la rueda o la barra.
// El dedo ya lo hace de serie, así que esto solo entra con puntero de ratón.
function useArrastreX(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let activo = false
    let inicioX = 0
    let inicioScroll = 0

    const bajar = (e) => {
      if (e.pointerType !== 'mouse') return
      activo = true
      inicioX = e.clientX
      inicioScroll = el.scrollLeft
      // El encaje pelea con el scroll a mano: se suelta mientras se arrastra y
      // al soltar el dedo vuelve, que es justo cuando se ve encajar.
      el.style.scrollSnapType = 'none'
      el.setPointerCapture(e.pointerId)
    }
    const mover = (e) => { if (activo) el.scrollLeft = inicioScroll - (e.clientX - inicioX) }
    const soltar = (e) => {
      if (!activo) return
      activo = false
      el.style.scrollSnapType = ''
      try { el.releasePointerCapture(e.pointerId) } catch { /* ya soltado */ }
    }

    el.addEventListener('pointerdown', bajar)
    el.addEventListener('pointermove', mover, { passive: true })
    el.addEventListener('pointerup', soltar)
    el.addEventListener('pointercancel', soltar)
    return () => {
      el.removeEventListener('pointerdown', bajar)
      el.removeEventListener('pointermove', mover)
      el.removeEventListener('pointerup', soltar)
      el.removeEventListener('pointercancel', soltar)
    }
  }, [ref])
}

export function SmoothScroll({ lang }) {
  const t = textoDe(lang)
  const ref = useRef(null)
  const anim = useRef(0)

  const ir = (suave) => {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(anim.current)
    const destino = el.scrollTop > 10 ? 0 : el.scrollHeight - el.clientHeight
    if (!suave) { el.scrollTop = destino; return }
    // El mismo lerp que usa Lenis: acercarse un 10% cada fotograma.
    const paso = () => {
      const falta = destino - el.scrollTop
      if (Math.abs(falta) < 0.5) { el.scrollTop = destino; return }
      el.scrollTop += falta * 0.1
      anim.current = requestAnimationFrame(paso)
    }
    paso()
  }

  useEffect(() => () => cancelAnimationFrame(anim.current), [])

  const filas = [t.inicio, t.seccion, t.seccion, t.seccion, t.final]

  return (
    <div className="cd-box">
      <div ref={ref} className="cd-scroller">
        {/* el hueco de abajo deja sitio a la barra de botones, que va fija */}
        <div className="p-3 pb-11 flex flex-col gap-2">
          {filas.map((f, i) => (
            <div key={i} className="cd-card" style={{ opacity: 1 - i * 0.12 }}>{f} {i + 1}</div>
          ))}
        </div>
      </div>
      <div className="cd-barra">
        <button className="cd-btn" onClick={() => ir(false)}>{t.saltoSeco}</button>
        <button className="cd-btn" onClick={() => ir(true)}>{t.conInercia}</button>
      </div>
    </div>
  )
}

export function Parallax({ lang }) {
  const t = textoDe(lang)
  const ref = useRef(null)
  const p = useProgresoScroll(ref)
  return (
    <div className="cd-box">
      <div
        className="cd-parallax-layer"
        style={{ background: `url(${FOTO}) center/cover`, transform: `translateY(${p * -34}px)` }}
      />
      <div
        className="cd-parallax-layer"
        style={{ background: 'radial-gradient(60% 50% at 50% 60%, rgba(99,102,241,.55), transparent)',
                 transform: `translateY(${p * -70}px)` }}
      />
      <div ref={ref} className="cd-scroller relative">
        <div style={{ height: '190%' }} />
        <div
          className="absolute left-3 font-extrabold text-lg text-white"
          style={{ top: '38%', transform: `translateY(${p * -110}px)`, textShadow: '0 2px 12px rgba(0,0,0,.8)' }}
        >
          {t.tresCapas}<br />{t.tresVelocidades}
        </div>
      </div>
      <span className="cd-hint">{t.scroll}</span>
    </div>
  )
}

export function ScrollSnap({ lang }) {
  const t = textoDe(lang)
  const ref = useRef(null)
  useArrastreX(ref)
  return (
    <div className="cd-box">
      <div ref={ref} className="cd-scroller-x cd-snap-x cd-arrastrable">
        <div className="cd-snap">
          {[t.uno, t.dos, t.tres, t.cuatro].map((x) => (
            <div key={x} className="cd-card grid place-items-center h-[92px] font-bold text-blue-300">{x}</div>
          ))}
        </div>
      </div>
      <span className="cd-hint">{t.arrastra}</span>
    </div>
  )
}

export function ScrollDriven({ lang }) {
  const t = textoDe(lang)
  const ref = useRef(null)
  const [nativo, setNativo] = useState(false)
  // Con soporte nativo la barra la mueve el CSS y el bucle de JS sobra.
  const p = useProgresoScroll(ref, !nativo)

  useEffect(() => {
    setNativo(
      typeof CSS !== 'undefined' &&
      CSS.supports?.('animation-timeline', 'scroll()') &&
      CSS.supports?.('timeline-scope', '--v')
    )
  }, [])

  return (
    <div className="cd-box cd-sd">
      <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800 z-10">
        <div className="cd-sd-js h-full bg-blue-500" style={{ width: `${p * 100}%` }} />
        <div className="cd-sd-css h-full bg-blue-500" />
      </div>
      <div ref={ref} className="cd-scroller pt-4">
        <div className="p-3 pb-8 flex flex-col gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="cd-card">{t.bloque} {i + 1}</div>
          ))}
        </div>
      </div>
      <div className="absolute left-3 bottom-2 cd-nota cd-nota-encima pointer-events-none">
        {nativo ? t.cssPuro : t.necesitaJs}
      </div>
    </div>
  )
}

export function ScrollReveal({ lang }) {
  const t = textoDe(lang)
  const ref = useRef(null)
  useEffect(() => {
    const raiz = ref.current
    if (!raiz) return
    const io = new IntersectionObserver(
      (entradas) => entradas.forEach((e) => { if (e.isIntersecting) e.target.dataset.in = 'true' }),
      { root: raiz, threshold: 0.6 }
    )
    raiz.querySelectorAll('.cd-reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="cd-box">
      <div ref={ref} className="cd-scroller">
        <div className="p-3 flex flex-col gap-2">
          <div className="cd-card text-zinc-400">{t.bajaParaVer}</div>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="cd-card cd-reveal" style={{ transitionDelay: `${i * 40}ms` }}>
              {t.apareceAlEntrar}
            </div>
          ))}
        </div>
      </div>
      <span className="cd-hint">{t.scroll}</span>
    </div>
  )
}

export function StickyPin({ lang }) {
  const t = textoDe(lang)
  return (
    <div className="cd-box">
      <div className="cd-scroller">
        <div className="cd-sticky-head">{t.meQuedoAqui}</div>
        <div className="p-3 flex flex-col gap-2">
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="cd-card">{t.contenido} {i}</div>)}
        </div>
      </div>
      <span className="cd-hint">{t.scroll}</span>
    </div>
  )
}

export function HorizontalScroll({ lang }) {
  const t = textoDe(lang)
  const ref = useRef(null)
  const p = useProgresoScroll(ref)
  return (
    <div className="cd-box">
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <div className="flex gap-3" style={{ transform: `translateX(${(0.5 - p) * 260}px)` }}>
          {['A', 'B', 'C', 'D', 'E'].map((x) => (
            <div key={x} className="cd-card w-[74px] h-[74px] grid place-items-center font-bold text-blue-300 shrink-0">
              {x}
            </div>
          ))}
        </div>
      </div>
      <div ref={ref} className="cd-scroller"><div style={{ height: '260%' }} /></div>
      <span className="cd-hint">{t.scrollMueve}</span>
    </div>
  )
}

export function Marquee({ lang }) {
  const t = textoDe(lang)
  const linea = ['parallax', 'sticky', 'snap', 'reveal', 'blend', 'noise']
  return (
    <div className="cd-box grid place-items-center">
      <div className="w-full overflow-hidden">
        <div className="cd-marquee-track">
          {[...linea, ...linea].map((x, i) => (
            <span key={i} className="font-extrabold text-xl text-blue-300/90 whitespace-nowrap">{x}</span>
          ))}
        </div>
      </div>
      <div className="cd-nota mt-2">{t.pasaParaParar}</div>
    </div>
  )
}

export function Scrollytelling({ lang }) {
  const t = textoDe(lang)
  const ref = useRef(null)
  const p = useProgresoScroll(ref)
  const paso = Math.min(t.story.length - 1, Math.floor(p * t.story.length))

  return (
    <div className="cd-box">
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <div
          className="w-14 h-14 rounded-lg bg-blue-500"
          style={{ transform: `scale(${0.5 + p * 1.1}) rotate(${p * 180}deg)`, opacity: 0.35 + p * 0.65 }}
        />
      </div>
      <div ref={ref} className="cd-scroller"><div style={{ height: '260%' }} /></div>
      <div className="absolute left-0 right-0 bottom-0 px-3 py-2 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none">
        <span className="font-semibold text-blue-200">{t.story[paso]}</span>
      </div>
      <span className="cd-hint">{t.scroll}</span>
    </div>
  )
}

export function PageTransitions({ lang }) {
  const t = textoDe(lang)
  const [vista, setVista] = useState(0)
  const vistas = [
    { t: t.portada, c: '#2563eb' },
    { t: t.detalle, c: '#0891b2' },
  ]

  const cambiar = () => {
    const siguiente = () => setVista((v) => (v + 1) % vistas.length)
    // La API nativa cuando existe; si no, el cambio se ve igual, sin la mezcla.
    if (document.startViewTransition) document.startViewTransition(siguiente)
    else siguiente()
  }

  const v = vistas[vista]
  return (
    <div className="cd-box grid place-items-center" style={{ background: v.c, transition: 'background .35s' }}>
      <div className="text-center">
        <div className="font-extrabold text-lg text-white">{v.t}</div>
        <button className="cd-btn mt-2" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.5)' }} onClick={cambiar}>
          {t.cambiarVista}
        </button>
      </div>
      <div className="absolute left-3 bottom-2 font-mono text-[10px] text-white/80 pointer-events-none">
        {typeof document !== 'undefined' && document.startViewTransition ? t.conViewTransitions : t.sinSoporteNativo}
      </div>
    </div>
  )
}

export const DEMOS = {
  'Smooth scroll': SmoothScroll,
  Parallax: Parallax,
  'Scroll Snap': ScrollSnap,
  'Scroll-driven animations': ScrollDriven,
  'Scroll reveal': ScrollReveal,
  'Sticky / Pin': StickyPin,
  'Horizontal scroll': HorizontalScroll,
  Marquee: Marquee,
  Scrollytelling: Scrollytelling,
  'Page transitions': PageTransitions,
}
