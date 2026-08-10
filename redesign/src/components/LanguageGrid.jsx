import { motion, AnimatePresence } from 'framer-motion'
import { Star, ArrowLeftRight, SearchX } from 'lucide-react'

export default function LanguageGrid({ t, list, total, selected, onSelect, favorites, onToggleFav, compareSet, onToggleCompare, onClearFilters }) {
  return (
    <section id="grid" className="px-6 sm:px-10 py-10">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{t.gridTitle}</h2>
        <span className="font-mono text-xs text-zinc-400">{t.gridSub(list.length, total)}</span>
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 text-zinc-400">
          <SearchX size={34} className="mb-3" />
          <p className="text-sm mb-4">{t.empty}</p>
          <button
            onClick={onClearFilters}
            className="rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 text-sm font-semibold px-4 py-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            {t.emptyReset}
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {list.map((l, i) => (
              <motion.article
                key={l.name}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                onClick={() => onSelect(l.name)}
                className={`rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border cursor-pointer transition-all hover:-translate-y-0.5 ${
                  selected === l.name
                    ? 'border-indigo-500 ring-1 ring-indigo-500'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div
                  className="h-32 grid place-items-center text-4xl relative"
                  style={{ background: `linear-gradient(135deg, ${l.color[0]}, ${l.color[1]})` }}
                >
                  <div
                    className="absolute inset-0 opacity-25"
                    style={{ background: 'radial-gradient(120px 90px at 30% 20%, #fff, transparent 70%)' }}
                  />
                  <span className="relative">{l.icon}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleFav(l.name) }}
                    aria-label={t.favoritos}
                    className="absolute top-2.5 right-2.5 w-7 h-7 grid place-items-center rounded-lg bg-black/25 backdrop-blur-sm text-white hover:bg-black/40 cursor-pointer"
                  >
                    <Star size={14} fill={favorites.has(l.name) ? 'currentColor' : 'none'} className={favorites.has(l.name) ? 'text-amber-300' : ''} />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-zinc-900 dark:text-zinc-50">{l.name}</span>
                    <span className="font-mono text-xs text-zinc-400">{l.pop}/100</span>
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-snug mb-3">{l.desc}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleCompare(l.name) }}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                      compareSet.has(l.name)
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200'
                    }`}
                  >
                    <ArrowLeftRight size={11} /> {t.comparar}
                  </button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  )
}
