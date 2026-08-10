import { motion, AnimatePresence } from 'framer-motion'
import { LANGUAGES } from '../data/languages'
import CodeBlock from './CodeBlock'

export default function DetailPanel({ t, selected }) {
  const lang = LANGUAGES.find((l) => l.name === selected) ?? LANGUAGES[0]

  return (
    <section className="px-6 sm:px-10 pb-16">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{t.detailTitle}</h2>
        <span className="font-mono text-xs text-zinc-400">{t.detailSub}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={lang.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="grid md:grid-cols-[1.1fr_1fr] rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
        >
          <div className="bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 md:border-r border-b md:border-b-0">
            <div className="flex items-center gap-1.5 px-3.5 py-3 border-b border-zinc-800">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 font-mono text-xs text-zinc-500">{lang.file}</span>
            </div>
            <div className="p-5">
              <CodeBlock tokens={lang.code} />
            </div>
          </div>

          <div className="p-6 flex flex-col gap-5">
            <div className="flex items-center gap-3.5">
              <div
                className="w-12 h-12 rounded-xl grid place-items-center text-2xl shrink-0"
                style={{ background: `linear-gradient(135deg, ${lang.color[0]}, ${lang.color[1]})` }}
              >
                {lang.icon}
              </div>
              <div>
                <h3 className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">{lang.name}</h3>
                <div className="font-mono text-xs text-zinc-400">
                  {t.aparicion(lang.year)} · {lang.fameLabel}
                </div>
              </div>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{lang.fullDesc}</p>

            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">{t.popularidad}</div>
              <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${lang.pop}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400"
                />
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">{t.ecosistema}</div>
              <div className="font-mono text-sm text-indigo-500 dark:text-indigo-300 flex flex-wrap items-center">
                {lang.eco.map((e, i) => (
                  <span key={e}>
                    {e}
                    {i < lang.eco.length - 1 && <span className="text-zinc-400 font-normal mx-2">·</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
