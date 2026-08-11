import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy } from 'lucide-react'
import EmptyState from './EmptyState'
import FavButton from './FavButton'
import { CONCEPT_EXAMPLES } from '../data/conceptExamples'
import { CONCEPT_EXAMPLES_EN } from '../data/conceptExamplesEn'

function Ejemplo({ t, code }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="mt-3 rounded-lg overflow-hidden bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between gap-2 px-2.5 py-1 border-b border-zinc-200 dark:border-zinc-800">
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">{t.conceptExample}</span>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1 text-[10px] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer transition-colors"
        >
          {copied ? <Check size={10} /> : <Copy size={10} />}
          {copied ? t.compCopied : t.compCopy}
        </button>
      </div>
      <pre className="px-2.5 py-2 overflow-x-auto font-mono text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-300">
        {code}
      </pre>
    </div>
  )
}

export default function ConceptsView({ t, lang, groups, onClear, favorites, onToggleFav }) {
  const total = groups.reduce((n, g) => n + g.items.length, 0)
  // El nombre del concepto es la clave interna (favoritos, ejemplos): solo
  // unos pocos cambian al traducirse, y esos traen nameEn y tagEn.
  const ejemplos = lang === 'en' ? CONCEPT_EXAMPLES_EN : CONCEPT_EXAMPLES

  return (
    <section className="px-6 sm:px-10 py-12 max-w-5xl">
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <h1 className="text-3xl font-extrabold tracking-tight">{t.conceptsTitle}</h1>
        <span className="font-mono text-xs text-zinc-400 shrink-0">{total}</span>
      </div>
      <p className="text-zinc-500 dark:text-zinc-400 mb-10">{t.conceptsSub}</p>

      {groups.length === 0 ? (
        <EmptyState t={t} onClear={onClear} />
      ) : (
        <div className="flex flex-col gap-9">
          {groups.map((group) => (
            <div key={group.key} className="scroll-mt-20">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-3">
                {group.label[lang]}
              </h2>
              <div className="grid sm:grid-cols-2 gap-3 items-start">
                {group.items.map((c, i) => (
                  <motion.div
                    key={c.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min((i % 6) * 0.03, 0.2) }}
                    className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-bold text-sm text-zinc-900 dark:text-zinc-50 min-w-0 flex-1">
                        {lang === 'en' && c.nameEn ? c.nameEn : c.name}
                      </span>
                      <span className="font-mono text-[11px] shrink-0" style={{ color: group.color }}>
                        {lang === 'en' && c.tagEn ? c.tagEn : c.tag}
                      </span>
                      <FavButton active={favorites.has(c.name)} onClick={() => onToggleFav(c.name)} label={t.favoritos} />
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{c[lang].what}</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">
                      <b className="text-zinc-500 dark:text-zinc-400">{t.conceptUse}:</b> {c[lang].use}
                    </p>
                    {ejemplos[c.name] && <Ejemplo t={t} code={ejemplos[c.name]} />}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
