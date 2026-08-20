import { useState } from 'react'
import { textoDe } from './texto'

// Demos del grupo "CSS moderno". Casi todas se manejan con un control para que
// se vea el antes y el después sin tener que redimensionar la ventana.

const rango = 'w-full accent-blue-500 h-1 cursor-pointer'

export function ContainerQueries({ lang }) {
  const t = textoDe(lang)
  const [ancho, setAncho] = useState(300)
  return (
    <div className="cd-box p-3 flex flex-col justify-center gap-3">
      <div className="cd-cq mx-auto" style={{ width: ancho, transition: 'width .1s linear' }}>
        <div className="cd-cq-grid grid grid-cols-1 gap-1.5 border border-zinc-700 rounded p-2">
          <div className="h-8 rounded bg-blue-500/70" />
          <div className="h-8 rounded bg-blue-500/40" />
        </div>
      </div>
      <input type="range" min="140" max="320" value={ancho} className={rango}
             onChange={(e) => setAncho(+e.target.value)} />
      <div className="cd-nota text-center">{t.contenedorMide(ancho)}</div>
    </div>
  )
}

export function FluidTypography({ lang }) {
  const t = textoDe(lang)
  const [ancho, setAncho] = useState(280)
  return (
    <div className="cd-box p-3 flex flex-col justify-center gap-3">
      <div className="cd-cq mx-auto grid place-items-center" style={{ width: ancho }}>
        <div className="cd-fluid font-extrabold text-blue-200 leading-none whitespace-nowrap">Vibeset</div>
      </div>
      <input type="range" min="120" max="330" value={ancho} className={rango}
             onChange={(e) => setAncho(+e.target.value)} />
      <div className="cd-nota text-center">{t.unaLineaCss}</div>
    </div>
  )
}

export function Has({ lang }) {
  const t = textoDe(lang)
  return (
    <div className="cd-box grid place-items-center">
      <form className="cd-has-form w-[190px]" onSubmit={(e) => e.preventDefault()}>
        <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
          <input type="checkbox" className="accent-blue-500" />
          {t.aceptoCondiciones}
        </label>
        <div className="cd-has-panel cd-card mt-3 text-center font-bold text-blue-300">{t.continuar}</div>
      </form>
      <span className="cd-hint">{t.marcalo}</span>
    </div>
  )
}

export function CascadeLayers({ lang }) {
  const t = textoDe(lang)
  return (
    <div className="cd-box p-3 flex flex-col justify-center gap-2">
      <div className="font-mono text-[10px] text-zinc-400">@layer cd-base, cd-comp, cd-util;</div>
      <div className="font-mono text-[10px] leading-relaxed text-zinc-600">
        <div>cd-base  →  {t.colorGris}</div>
        <div>cd-comp  →  {t.colorIndigo}</div>
        <div>cd-util  →  {t.colorVerde}</div>
      </div>
      <div className="cd-layer-demo font-extrabold text-lg">{t.ganaUltima}</div>
      <div className="cd-nota">{t.mismaEspecificidad}</div>
    </div>
  )
}

export function ColorMix() {
  const [pct, setPct] = useState(50)
  const mezcla = `color-mix(in oklab, #3b82f6 ${pct}%, #f97316)`
  return (
    <div className="cd-box p-3 flex flex-col justify-center gap-3">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded shrink-0" style={{ background: '#3b82f6' }} />
        <div className="flex-1 h-9 rounded" style={{ background: mezcla }} />
        <div className="w-7 h-7 rounded shrink-0" style={{ background: '#f97316' }} />
      </div>
      <input type="range" min="0" max="100" value={pct} className={rango}
             onChange={(e) => setPct(+e.target.value)} />
      <div className="cd-nota text-center truncate">
        in oklab, #3b82f6 {pct}%, #f97316
      </div>
    </div>
  )
}

export function Subgrid({ lang }) {
  const t = textoDe(lang)
  const [on, setOn] = useState(true)
  return (
    <div className="cd-box p-3 flex flex-col justify-center gap-3">
      <div className="grid grid-cols-3 gap-1.5" style={{ gridTemplateRows: 'auto auto auto' }}>
        {t.subgridCortas.map((c) => (
          <div key={c.t} className={on ? 'cd-subgrid' : 'flex flex-col gap-1'}>
            <div className="font-bold text-[10px] text-zinc-100 leading-tight">{c.t}</div>
            <div className="text-[9px] text-zinc-400 leading-tight">{c.d}</div>
            <div className="h-4 rounded bg-blue-500/70 self-end" />
          </div>
        ))}
      </div>
      <button className="cd-btn self-start" data-on={on} onClick={() => setOn((v) => !v)}>
        subgrid: {on ? t.subgridSi : t.subgridNo}
      </button>
    </div>
  )
}

export function LogicalProperties({ lang }) {
  const t = textoDe(lang)
  const [rtl, setRtl] = useState(false)
  return (
    <div className="cd-box grid place-items-center gap-3">
      <div dir={rtl ? 'rtl' : 'ltr'} className="w-[190px]">
        <div
          className="cd-card"
          style={{ borderInlineStart: '3px solid #3b82f6', paddingInlineStart: 12, marginInline: 'auto' }}
        >
          {rtl ? 'يبدأ من اليمين' : t.empiezaIzquierda}
        </div>
      </div>
      <button className="cd-btn" onClick={() => setRtl((v) => !v)}>
        {t.direccion}: {rtl ? 'rtl' : 'ltr'}
      </button>
      <div className="cd-nota">{t.bordeCambia}</div>
    </div>
  )
}

export const DEMOS = {
  'Container queries': ContainerQueries,
  'Fluid typography': FluidTypography,
  ':has()': Has,
  'Cascade layers': CascadeLayers,
  'color-mix()': ColorMix,
  Subgrid: Subgrid,
  'Logical properties': LogicalProperties,
}
