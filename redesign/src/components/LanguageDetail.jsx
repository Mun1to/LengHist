import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowLeftRight, ExternalLink } from 'lucide-react'
import FavButton from './FavButton'
import CopiarEnlace from './CopiarEnlace'
import { LANGUAGES, FAME_LABEL, wikiUrl } from '../data/languages'
import { codeFor } from '../data/codeEn'
import { rutaDe } from '../lib/rutas'

// Cada lenguaje tiene su propia página, como cada componente y cada skill. Antes
// era un panel al final de una rejilla de cien tarjetas: al pulsar una no pasaba
// nada visible porque la ficha quedaba veinte pantallas más abajo.
function Dato({ titulo, children, mono = false }) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">{titulo}</div>
      <div className={`text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed ${mono ? 'font-mono' : ''}`}>
        {children}
      </div>
    </div>
  )
}

export default function LanguageDetail({ t, lang, nombre, fav, onToggleFav, enComparacion, onToggleCompare }) {
  const l = LANGUAGES.find((x) => x.name === nombre)
  const d = l[lang]
  const wiki = wikiUrl(l, lang)
  const code = codeFor(l, lang)

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="px-6 sm:px-10 py-10 max-w-5xl"
    >
      <Link
        to={rutaDe('languages')}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        {t.langBack}
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <span className="w-1.5 h-7 rounded-full shrink-0" style={{ background: l.color[0] }} />
            {l.name}
          </h1>
          <div className="font-mono text-xs text-zinc-400 dark:text-zinc-500 mt-2">
            {t.aparicion(l.year)} · {FAME_LABEL[l.fame][lang]} · {d.paradigm}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <CopiarEnlace t={t} />
          <FavButton active={fav} onClick={onToggleFav} label={t.favoritos} />
        </div>
      </div>

      <p className="text-zinc-500 dark:text-zinc-400 mt-5 max-w-2xl leading-relaxed">{d.fullDesc}</p>

      <button
        onClick={onToggleCompare}
        className={`inline-flex items-center gap-1.5 mt-5 h-8 px-3 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
          enComparacion
            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
            : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
        }`}
      >
        <ArrowLeftRight size={12} /> {t.comparar}
      </button>

      {/* El ejemplo de código es lo primero que la gente mira: cómo se ve de
          verdad el lenguaje, no cómo se lo cuentan. */}
      <div className="mt-8 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950">
        <div className="flex items-center gap-1.5 px-3.5 py-3 border-b border-zinc-800">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 font-mono text-xs text-zinc-500">{code.file}</span>
        </div>
        <pre className="p-5 font-mono text-[13px] leading-relaxed text-zinc-200 overflow-x-auto">{code.example}</pre>
      </div>

      <div className="grid sm:grid-cols-2 gap-x-10 gap-y-7 mt-10">
        <Dato titulo={t.creador}>{l.creator}</Dato>
        <Dato titulo={t.popularidad}>
          <div className="flex items-center gap-3">
            <div className="h-1.5 flex-1 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${l.pop}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full bg-indigo-500"
              />
            </div>
            <span className="font-mono text-xs text-zinc-400 shrink-0">{l.pop}/100</span>
          </div>
        </Dato>

        <Dato titulo={t.extensiones} mono>
          <span className="text-indigo-600 dark:text-indigo-400">{l.extensions.join('  ')}</span>
        </Dato>
        <Dato titulo={t.usos}>{d.uses.join(' · ')}</Dato>

        {l.eco.length > 0 && (
          <div className="sm:col-span-2">
            <Dato titulo={t.ecosistema} mono>
              <span className="text-emerald-600 dark:text-emerald-400">{l.eco.join(' · ')}</span>
            </Dato>
          </div>
        )}

        <Dato titulo={t.ventajas}>
          <ul className="flex flex-col gap-1.5">
            {d.pros.map((p) => (
              <li key={p} className="flex gap-2">
                <span className="text-emerald-500 font-bold shrink-0">+</span>{p}
              </li>
            ))}
          </ul>
        </Dato>
        <Dato titulo={t.desventajas}>
          <ul className="flex flex-col gap-1.5">
            {d.cons.map((c) => (
              <li key={c} className="flex gap-2">
                <span className="text-rose-500 font-bold shrink-0">−</span>{c}
              </li>
            ))}
          </ul>
        </Dato>
      </div>

      {wiki && (
        <div className="mt-12 pt-5 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <a
            href={wiki}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-400/70 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
          >
            <ExternalLink size={11} /> Wikipedia ({lang.toUpperCase()})
          </a>
        </div>
      )}
    </motion.section>
  )
}
