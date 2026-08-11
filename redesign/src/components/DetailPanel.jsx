import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { LANGUAGES, FAME_LABEL, wikiUrl } from '../data/languages'
import { codeFor } from '../data/codeEn'

export default function DetailPanel({ t, lang, selected }) {
  const l = LANGUAGES.find((x) => x.name === selected) ?? LANGUAGES[0]
  const d = l[lang]
  const wiki = wikiUrl(l, lang)
  const code = codeFor(l, lang)

  return (
    <section className="px-6 sm:px-10 pb-16">
      <div className="flex items-baseline justify-between gap-4 mb-4">
        <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{t.detailTitle}</h2>
        <span className="font-mono text-xs text-zinc-400 shrink-0">{t.detailSub}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={l.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="grid md:grid-cols-[1.1fr_1fr] rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
        >
          <div className="bg-zinc-950 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
            <div className="flex items-center gap-1.5 px-3.5 py-3 border-b border-zinc-800">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 font-mono text-xs text-zinc-500">{code.file}</span>
            </div>
            <pre className="p-5 font-mono text-[13px] leading-relaxed text-zinc-200 overflow-x-auto flex-1">{code.example}</pre>
          </div>

          <div className="p-6 flex flex-col gap-5">
            <div className="flex items-center gap-3.5">
              <div
                className="w-12 h-12 rounded-xl grid place-items-center text-2xl shrink-0"
                style={{ background: `linear-gradient(135deg, ${l.color[0]}, ${l.color[1]})` }}
              >
                {l.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">{l.name}</h3>
                <div className="font-mono text-xs text-zinc-400">
                  {t.aparicion(l.year)} · {FAME_LABEL[l.fame][lang]}
                </div>
              </div>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{d.fullDesc}</p>

            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">{t.popularidad}</div>
              <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${l.pop}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full bg-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">{t.extensiones}</div>
              <div className="font-mono text-sm text-indigo-500 dark:text-indigo-400">{l.extensions.join('  ')}</div>
            </div>

            {l.eco.length > 0 && (
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">{t.ecosistema}</div>
                <div className="font-mono text-sm text-emerald-600 dark:text-emerald-400 leading-relaxed">
                  {l.eco.join(' · ')}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-5">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">{t.ventajas}</div>
                <ul className="flex flex-col gap-1.5">
                  {d.pros.map((p) => (
                    <li key={p} className="text-xs text-zinc-600 dark:text-zinc-400 flex gap-1.5">
                      <span className="text-emerald-500 font-bold shrink-0">+</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">{t.desventajas}</div>
                <ul className="flex flex-col gap-1.5">
                  {d.cons.map((c) => (
                    <li key={c} className="text-xs text-zinc-600 dark:text-zinc-400 flex gap-1.5">
                      <span className="text-rose-500 font-bold shrink-0">−</span>{c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5 text-sm">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">{t.creador}</div>
                <div className="text-zinc-700 dark:text-zinc-300 font-medium">{l.creator}</div>
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">{t.paradigma}</div>
                <div className="text-zinc-700 dark:text-zinc-300 font-medium">{d.paradigm}</div>
              </div>
            </div>

            {wiki && (
              <a
                href={wiki}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors self-start"
              >
                <ExternalLink size={12} /> Wikipedia ({lang.toUpperCase()})
              </a>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
