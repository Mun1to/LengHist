import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import EmptyState from './EmptyState'
import FavButton from './FavButton'

export default function ResourcesView({ t, lang, groups, onClear, favorites, onToggleFav }) {
  const total = groups.reduce((n, g) => n + g.items.length, 0)

  return (
    <section className="px-6 sm:px-10 py-12 max-w-5xl">
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <h1 className="text-3xl font-extrabold tracking-tight">{t.resTitle}</h1>
        <span className="font-mono text-xs text-zinc-400 shrink-0">{total}</span>
      </div>
      <p className="text-zinc-500 dark:text-zinc-400 mb-10">{t.resSub}</p>

      {groups.length === 0 ? (
        <EmptyState t={t} onClear={onClear} />
      ) : (
        <div className="flex flex-col gap-9">
          {groups.map((group, gi) => (
            <div key={group.key} className="scroll-mt-20">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-3">
                {group.label[lang]}
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {group.items.map((r, i) => (
                  <motion.a
                    key={r.name}
                    href={r.url}
                    target="_blank"
                    rel="noopener"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(gi * 0.04 + i * 0.02, 0.3) }}
                    className="flex items-start gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-sm text-zinc-900 dark:text-zinc-50">{r.name}</div>
                      <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{r[lang]}</div>
                    </div>
                    <FavButton active={favorites.has(r.name)} onClick={() => onToggleFav(r.name)} label={t.favoritos} />
                    <ArrowUpRight size={15} className="shrink-0 text-zinc-400 mt-1.5" />
                  </motion.a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
