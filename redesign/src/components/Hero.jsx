import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LANGUAGES, HERO_PILLS } from '../data/languages'
import CodeBlock from './CodeBlock'

const DEMO_TABS = ['Python', 'JavaScript', 'Rust', 'Go']

export default function Hero({ t, filter, setFilter, onExplore }) {
  const [tab, setTab] = useState('Python')
  const lang = LANGUAGES.find((l) => l.name === tab)

  const isPillActive = (pillFilter) => {
    if (pillFilter.type === 'all') return filter.type === 'all'
    if (pillFilter.type === 'cat') return filter.type === 'cat' && filter.value === pillFilter.value
    if (pillFilter.type === 'fame') return filter.type === 'fame' && filter.value === pillFilter.value
    if (pillFilter.type === 'recent') return filter.type === 'recent'
    return false
  }

  return (
    <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800 px-6 sm:px-10 py-16 sm:py-24">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(1000px 480px at 8% -18%, color-mix(in srgb, #6366f1 34%, transparent), transparent 60%), radial-gradient(760px 420px at 104% -6%, color-mix(in srgb, #22d3ee 20%, transparent), transparent 65%)',
        }}
      />
      <div className="absolute inset-0 -z-10 dot-grid opacity-60 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 -z-10 grain opacity-[0.035] mix-blend-overlay pointer-events-none" />

      <div className="relative grid lg:grid-cols-[1.05fr_.95fr] gap-12 items-center max-w-6xl">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[.12em] text-indigo-600 dark:text-indigo-400 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_theme(colors.emerald.400)]" />
            {t.heroKicker}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-[2.6rem] sm:text-[3.4rem] leading-[1.14] font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4"
          >
            {t.heroTitle1}
            <span className="block text-indigo-600 dark:text-indigo-400">{t.heroTitle2}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-zinc-600 dark:text-zinc-400 text-lg max-w-md mb-7 leading-relaxed"
          >
            {t.heroSub}
          </motion.p>

          <div className="flex flex-wrap gap-3 mb-7">
            <button
              onClick={onExplore}
              className="rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold px-5.5 py-3 text-sm cursor-pointer hover:opacity-90 transition-opacity"
            >
              {t.exploreBtn}
            </button>
            <button
              onClick={onExplore}
              className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 border-b border-zinc-300 dark:border-zinc-600 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer self-center pb-0.5"
            >
              {t.testBtn}
            </button>
          </div>

          <div className="font-mono text-xs text-zinc-400 dark:text-zinc-500 tracking-wide mb-6">
            {t.stats({ langs: 100, res: 64, concepts: 41 })}
          </div>

          <div className="flex flex-wrap items-center gap-5 pt-5 border-t border-zinc-200 dark:border-zinc-800">
            {HERO_PILLS.map((p) => (
              <button
                key={p.label}
                onClick={() => setFilter(p.filter)}
                className={`font-mono text-sm pb-0.5 border-b cursor-pointer transition-colors ${
                  isPillActive(p.filter)
                    ? 'text-indigo-600 dark:text-indigo-300 font-bold border-indigo-500'
                    : 'text-zinc-400 dark:text-zinc-500 border-transparent hover:text-zinc-600 dark:hover:text-zinc-300'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-[0_20px_60px_rgba(0,0,0,.35)]"
        >
          <div className="flex items-center gap-1.5 px-3.5 py-3 border-b border-zinc-800">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            <div className="flex gap-0.5 ml-2.5">
              {DEMO_TABS.map((tb) => (
                <button
                  key={tb}
                  onClick={() => setTab(tb)}
                  className={`font-mono text-[13px] px-1 pb-0.5 border-b cursor-pointer transition-colors ${
                    tab === tb ? 'text-zinc-100 border-indigo-400' : 'text-zinc-500 border-transparent hover:text-zinc-300'
                  }`}
                >
                  {tb}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 min-h-[150px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={lang.name}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                <CodeBlock tokens={lang.code} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800 font-mono text-xs text-zinc-500">
            <span>
              {lang.icon} {lang.name} · {lang.year}
            </span>
            <span className="text-indigo-300 font-bold">{lang.pop}/100 popularidad</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
