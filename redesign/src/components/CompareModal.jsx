import Modal from './Modal'
import { LANGUAGES } from '../data/languages'

export default function CompareModal({ t, lang, open, onClose, names }) {
  const items = names.map((n) => LANGUAGES.find((l) => l.name === n)).filter(Boolean)
  if (!items.length) return null

  const Row = ({ label, render }) => (
    <tr className="border-b border-zinc-200 dark:border-zinc-800 align-top">
      <td className="py-3 pr-4 text-[11px] font-bold uppercase tracking-wider text-zinc-400 whitespace-nowrap">{label}</td>
      {items.map((l) => (
        <td key={l.name} className="py-3 px-3 text-sm text-zinc-600 dark:text-zinc-300">{render(l)}</td>
      ))}
    </tr>
  )

  return (
    <Modal open={open} onClose={onClose} title={t.cmpTitle} closeLabel={t.cerrar} wide>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[520px]">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th />
              {items.map((l) => (
                <th key={l.name} className="py-3 px-3 text-left">
                  <span className="flex items-center gap-2 font-extrabold" style={{ color: l.color[0] }}>
                    <span className="w-1.5 h-5 rounded-full shrink-0" style={{ background: l.color[0] }} />{l.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <Row label={t.aparicion('')} render={(l) => <span className="font-mono">{l.year}</span>} />
            <Row label={t.creador} render={(l) => l.creator} />
            <Row label={t.paradigma} render={(l) => l[lang].paradigm} />
            <Row label={t.popularidad} render={(l) => (
              <>
                <span className="font-mono text-xs">{l.pop}/100</span>
                <div className="h-1.5 mt-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: `${l.pop}%` }} />
                </div>
              </>
            )} />
            <Row label={t.extensiones} render={(l) => (
              <span className="font-mono text-xs text-indigo-500 dark:text-indigo-400">{l.extensions.join(' ')}</span>
            )} />
            <Row label={t.ecosistema} render={(l) => (
              <span className="font-mono text-xs text-indigo-500 dark:text-indigo-400">{l.eco.join(' · ') || '—'}</span>
            )} />
            <Row label={t.usos} render={(l) => l[lang].uses.join(', ')} />
            <Row label={t.ventajas} render={(l) => (
              <ul className="flex flex-col gap-1">{l[lang].pros.map((p) => <li key={p} className="text-xs"><span className="text-emerald-500 font-bold">+</span> {p}</li>)}</ul>
            )} />
            <Row label={t.desventajas} render={(l) => (
              <ul className="flex flex-col gap-1">{l[lang].cons.map((c) => <li key={c} className="text-xs"><span className="text-rose-500 font-bold">−</span> {c}</li>)}</ul>
            )} />
          </tbody>
        </table>
      </div>
    </Modal>
  )
}
