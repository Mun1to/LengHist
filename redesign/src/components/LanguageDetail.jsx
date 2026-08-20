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
      <div className="text-[11px] font-bold uppercase tracking-wider text-tinta-suave mb-1.5">{titulo}</div>
      <div className={`text-sm text-tinta-fuerte leading-relaxed ${mono ? 'font-mono' : ''}`}>
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
        className="inline-flex items-center gap-1.5 min-h-6 px-1.5 -mx-1.5 text-sm text-tinta-suave hover:text-tinta transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        {t.langBack}
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <span className="w-1.5 h-7 shrink-0" style={{ background: l.color[0] }} />
            {l.name}
          </h1>
          <div className="font-mono text-xs text-tinta-suave mt-2">
            {t.aparicion(l.year)} · {FAME_LABEL[l.fame][lang]} · {d.paradigm}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <CopiarEnlace t={t} />
          <FavButton active={fav} onClick={onToggleFav} label={t.favoritos} />
        </div>
      </div>

      <p className="text-tinta-suave mt-5 max-w-2xl leading-relaxed">{d.fullDesc}</p>

      <button
        onClick={onToggleCompare}
        className={`inline-flex items-center gap-1.5 mt-5 h-8 px-3 border text-xs font-semibold cursor-pointer transition-colors ${
          enComparacion
            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
            : 'border-linea text-tinta-suave hover:border-linea-viva'
        }`}
      >
        <ArrowLeftRight size={12} /> {t.comparar}
      </button>

      {/* El ejemplo de código es lo primero que la gente mira: cómo se ve de
          verdad el lenguaje, no cómo se lo cuentan. */}
      <div className="mt-8 overflow-hidden border border-linea bg-zinc-950">
        {/* El nombre del archivo hace de rotulo, sin los tres puntos de
            macOS: la barra de color del lenguaje ya identifica la ficha. */}
        <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-zinc-800">
          <span className="w-1 h-3.5 shrink-0" style={{ background: l.color[0] }} />
          <span className="font-mono text-xs text-zinc-400">{code.file}</span>
        </div>
        <pre className="p-5 font-mono text-[13px] leading-relaxed text-zinc-200 overflow-x-auto">{code.example}</pre>
      </div>

      <div className="grid sm:grid-cols-2 gap-x-10 gap-y-7 mt-10">
        <Dato titulo={t.creador}>{l.creator}</Dato>
        <Dato titulo={t.popularidad}>
          <div className="flex items-center gap-3">
            <div className="h-1.5 flex-1 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${l.pop}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full bg-blue-500"
              />
            </div>
            <span className="font-mono text-xs text-tinta-suave shrink-0">{l.pop}/100</span>
          </div>
        </Dato>

        <Dato titulo={t.extensiones} mono>
          <span className="text-blue-600 dark:text-blue-400">{l.extensions.join('  ')}</span>
        </Dato>
        <Dato titulo={t.usos}>{d.uses.join(' · ')}</Dato>

        {l.eco.length > 0 && (
          <div className="sm:col-span-2">
            <Dato titulo={t.ecosistema} mono>
              <span className="text-esmeralda">{l.eco.join(' · ')}</span>
            </Dato>
          </div>
        )}

        <Dato titulo={t.ventajas}>
          <ul className="flex flex-col gap-1.5">
            {d.pros.map((p) => (
              <li key={p} className="flex gap-2">
                <span className="text-esmeralda font-bold shrink-0">+</span>{p}
              </li>
            ))}
          </ul>
        </Dato>
        <Dato titulo={t.desventajas}>
          <ul className="flex flex-col gap-1.5">
            {d.cons.map((c) => (
              <li key={c} className="flex gap-2">
                <span className="text-rojo font-bold shrink-0">−</span>{c}
              </li>
            ))}
          </ul>
        </Dato>
      </div>

      {wiki && (
        <div className="mt-12 pt-5 border-t border-linea/60">
          <a
            href={wiki}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 min-h-6 font-mono text-[11px] text-tinta-suave hover:text-tinta transition-colors"
          >
            <ExternalLink size={11} /> Wikipedia ({lang.toUpperCase()})
          </a>
        </div>
      )}
    </motion.section>
  )
}
