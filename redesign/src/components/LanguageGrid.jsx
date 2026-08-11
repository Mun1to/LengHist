import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftRight } from 'lucide-react'
import EmptyState from './EmptyState'
import FavButton from './FavButton'

export default function LanguageGrid({ t, lang, list, total, selected, onSelect, favorites, onToggleFav, compareSet, onToggleCompare, onClearFilters }) {
  return (
    <section id="grid" className="px-6 sm:px-10 pt-2 pb-10">
      {list.length === 0 ? (
        <EmptyState t={t} onClear={onClearFilters} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {list.map((l, i) => (
              <motion.article
                key={l.name}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.22, delay: Math.min(i, 12) * 0.02 }}
                onClick={() => onSelect(l.name)}
                className={`rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border cursor-pointer transition-all hover:-translate-y-0.5 ${
                  selected === l.name
                    ? 'border-indigo-500 ring-1 ring-indigo-500'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div
                  className="h-28 grid place-items-center text-4xl relative"
                  style={{ background: `linear-gradient(135deg, ${l.color[0]}, ${l.color[1]})` }}
                >
                  <div className="absolute inset-0 opacity-25" style={{ background: 'radial-gradient(120px 90px at 30% 20%, #fff, transparent 70%)' }} />
                  <span className="relative">{l.icon}</span>
                  <FavButton active={favorites.has(l.name)} onClick={() => onToggleFav(l.name)} label={t.favoritos} floating />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-zinc-900 dark:text-zinc-50 truncate">{l.name}</span>
                    <span className="font-mono text-xs text-zinc-400 shrink-0">{l.pop}/100</span>
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-snug line-clamp-2 mb-3">{l[lang].desc}</p>
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
