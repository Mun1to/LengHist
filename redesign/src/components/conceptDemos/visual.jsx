import { useEffect, useRef, useState } from 'react'
import { textoDe } from './texto'

// Demos del grupo "Estética y efectos".

const FOTO = '/demo/paisaje-1.jpg'

export function Glassmorphism({ lang }) {
  const t = textoDe(lang)
  return (
    <div className="cd-box grid place-items-center" style={{ background: `url(${FOTO}) center/cover` }}>
      <div className="cd-glass rounded-xl px-6 py-4 text-center">
        <div className="font-extrabold text-white">{t.cristal}</div>
        <div className="text-[10px] text-white/80 mt-0.5">{t.desenfoca}</div>
      </div>
    </div>
  )
}

export function Neumorphism({ lang }) {
  const t = textoDe(lang)
  const [pulsado, setPulsado] = useState(false)
  return (
    <div className="cd-box grid place-items-center gap-3" style={{ background: '#e0e5ec' }}>
      <button
        className="cd-neu rounded-2xl px-6 py-3 font-bold cursor-pointer"
        data-pressed={pulsado ? 'true' : 'false'}
        onClick={() => setPulsado((v) => !v)}
      >
        {pulsado ? t.hundido : t.enRelieve}
      </button>
      <span className="font-mono text-[10px]" style={{ color: "#6b7784" }}>{t.pulsaHundir}</span>
    </div>
  )
}

export function Aurora() {
  return (
    <div className="cd-box grid place-items-center" style={{ background: '#0b0b12' }}>
      <div className="cd-aurora" style={{ background: 'radial-gradient(40% 40% at 25% 30%, #3b82f6, transparent 70%)' }} />
      <div className="cd-aurora" style={{ background: 'radial-gradient(38% 38% at 75% 35%, #22d3ee, transparent 70%)', animationDelay: '-4s' }} />
      <div className="cd-aurora" style={{ background: 'radial-gradient(42% 42% at 55% 78%, #a855f7, transparent 70%)', animationDelay: '-8s' }} />
      <div className="relative font-extrabold text-white text-lg tracking-tight">aurora</div>
    </div>
  )
}

export function ClipPath({ lang }) {
  const t = textoDe(lang)
  const [forma, setForma] = useState(0)
  const formas = [
    { n: t.poligono, v: 'polygon(0 0, 100% 8%, 100% 100%, 0 92%)' },
    { n: t.circulo, v: 'circle(42% at 50% 50%)' },
    { n: t.flecha, v: 'polygon(0 20%, 70% 20%, 70% 0, 100% 50%, 70% 100%, 70% 80%, 0 80%)' },
  ]
  const f = formas[forma]
  return (
    <div className="cd-box grid place-items-center gap-2">
      <div
        className="w-[150px] h-[76px]"
        style={{ background: `url(${FOTO}) center/cover`, clipPath: f.v, transition: 'clip-path .4s ease' }}
      />
      <button className="cd-btn" onClick={() => setForma((i) => (i + 1) % formas.length)}>
        {t.forma}: {f.n}
      </button>
    </div>
  )
}

export function ViewTransitions({ lang }) {
  const t = textoDe(lang)
  const [grande, setGrande] = useState(false)
  const soporta = typeof document !== 'undefined' && !!document.startViewTransition

  const alternar = () => {
    const cambio = () => setGrande((v) => !v)
    if (document.startViewTransition) document.startViewTransition(cambio)
    else cambio()
  }

  return (
    <div className="cd-box grid place-items-center gap-2">
      {/* botón y no div: se pulsa con el dedo, con el ratón y con el teclado */}
      <button
        onClick={alternar}
        aria-expanded={grande}
        className="cursor-pointer grid place-items-center font-bold text-white overflow-hidden"
        style={{
          width: grande ? 140 : 62,
          height: grande ? 76 : 62,
          borderRadius: grande ? 10 : 999,
          background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
          transition: soporta ? 'none' : 'all .35s ease',
          viewTransitionName: 'cd-vt-card',
        }}
      >
        {grande ? t.abierto : '+'}
      </button>
      <span className="cd-nota">{soporta ? t.interpola : t.transicionNormal}</span>
    </div>
  )
}

// Una ficha de perfil a medio cargar. El relleno se le pasa desde fuera para
// poder pintar la misma ficha con las dos versiones y compararlas de verdad:
// por separado no se ve que ocupan el mismo hueco, que es medio motivo de
// montar un esqueleto en vez de un spinner.
function FichaEsqueleto({ cargado, relleno, rotulo, t }) {
  return (
    <div className="flex flex-col gap-2 min-w-0">
      <div className="flex gap-2 items-center">
        {cargado
          ? <div className="w-8 h-8 rounded-full bg-blue-500 shrink-0" />
          : <div className={`${relleno} cd-skeleton-redondo w-8 h-8 shrink-0`} />}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          {cargado ? (
            <>
              <div className="font-bold text-[11px] text-zinc-100 truncate">Munir Torres</div>
              <div className="text-[10px] text-zinc-400 truncate">{t.bioPerfil}</div>
            </>
          ) : (
            <>
              <div className={`${relleno} h-2.5 w-[60%]`} />
              <div className={`${relleno} h-2.5 w-[85%]`} />
            </>
          )}
        </div>
      </div>
      <span className="cd-nota">{rotulo}</span>
    </div>
  )
}

export function Skeleton({ lang }) {
  const t = textoDe(lang)
  const [cargado, setCargado] = useState(false)
  const temporizador = useRef(0)

  // El botón repite la espera entera. Antes alternaba el estado y se rotulaba
  // con él, así que ponía "cargando…" cuando lo que hacía era terminar de cargar.
  const reiniciar = () => {
    clearTimeout(temporizador.current)
    setCargado(false)
    temporizador.current = setTimeout(() => setCargado(true), 2200)
  }

  useEffect(() => {
    temporizador.current = setTimeout(() => setCargado(true), 2200)
    return () => clearTimeout(temporizador.current)
  }, [])

  return (
    <div className="cd-box p-3 flex flex-col justify-center">
      <div className="grid grid-cols-2 gap-3">
        <FichaEsqueleto cargado={cargado} relleno="cd-skeleton-fijo" rotulo={t.esqueletoFijo} t={t} />
        <FichaEsqueleto cargado={cargado} relleno="cd-skeleton" rotulo={t.esqueletoBrillo} t={t} />
      </div>
      <button className="cd-btn mt-3 self-start" onClick={reiniciar}>{t.volverCargar}</button>
    </div>
  )
}

export function TipografiaCinetica({ lang }) {
  const t = textoDe(lang)
  const [ronda, setRonda] = useState(0)
  return (
    <div className="cd-box grid place-items-center gap-3">
      <div className="font-extrabold text-2xl tracking-tight text-blue-200">
        {t.palabraCinetica.split('').map((c, i) => (
          <span key={`${ronda}-${i}`} className="cd-char" style={{ animationDelay: `${i * 45}ms` }}>{c}</span>
        ))}
      </div>
      <button className="cd-btn" onClick={() => setRonda((r) => r + 1)}>{t.otraVez}</button>
    </div>
  )
}

export function Noise({ lang }) {
  const t = textoDe(lang)
  const [on, setOn] = useState(true)
  return (
    <div className="cd-box grid place-items-center">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #2563eb, #0891b2)' }} />
      {on && (
        <svg className="absolute inset-0 w-full h-full opacity-[.22] mix-blend-overlay pointer-events-none">
          <filter id="cd-grano">
            <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" />
          </filter>
          <rect width="100%" height="100%" filter="url(#cd-grano)" />
        </svg>
      )}
      <div className="relative text-center">
        <div className="font-extrabold text-white text-lg">{on ? t.conGrano : t.plano}</div>
        <button className="cd-btn mt-1" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.5)' }} onClick={() => setOn((v) => !v)}>
          {t.cambiar}
        </button>
      </div>
    </div>
  )
}

export function Preloader({ lang }) {
  const t = textoDe(lang)
  const [cargando, setCargando] = useState(true)
  const timer = useRef(0)

  useEffect(() => {
    timer.current = setTimeout(() => setCargando(false), 1800)
    return () => clearTimeout(timer.current)
  }, [])

  const reiniciar = () => {
    clearTimeout(timer.current)
    setCargando(true)
    timer.current = setTimeout(() => setCargando(false), 1800)
  }

  return (
    <div className="cd-box grid place-items-center">
      <div className="text-center">
        <div className="font-extrabold text-lg text-blue-200">{t.contenidoListo}</div>
        <button className="cd-btn mt-1" onClick={reiniciar}>{t.volverCargar}</button>
      </div>
      <div
        className="absolute inset-0 grid place-items-center bg-zinc-950"
        style={{ opacity: cargando ? 1 : 0, pointerEvents: cargando ? 'auto' : 'none', transition: 'opacity .5s ease' }}
      >
        <div className="cd-spinner" />
      </div>
    </div>
  )
}

export const DEMOS = {
  Glassmorphism: Glassmorphism,
  Neumorphism: Neumorphism,
  'Aurora / mesh gradient': Aurora,
  'Clip-path y máscaras': ClipPath,
  'View Transitions': ViewTransitions,
  'Skeleton loaders': Skeleton,
  'Tipografía cinética': TipografiaCinetica,
  'Noise / grain': Noise,
  Preloader: Preloader,
}
