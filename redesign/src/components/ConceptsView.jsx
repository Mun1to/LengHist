import { motion } from 'framer-motion'
import EmptyState from './EmptyState'
import FavButton from './FavButton'

export default function ConceptsView({ t, lang, groups, onClear, favorites, onToggleFav }) {
  const total = groups.reduce((n, g) => n + g.items.length, 0)

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
              <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-3">
                <span className="w-2.5 h-1 rounded-full" style={{ background: group.color }} />
                {group.label[lang]}
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {group.items.map((c, i) => (
                  <motion.div
                    key={c.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min((i % 6) * 0.03, 0.2) }}
                    className="rounded-xl border-l-[3px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4"
                    style={{ borderLeftColor: group.color }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-bold text-sm text-zinc-900 dark:text-zinc-50 min-w-0 flex-1">{c.name}</span>
                      <span className="font-mono text-[11px] shrink-0" style={{ color: group.color }}>
                        {c.tag}
                      </span>
                      <FavButton active={favorites.has(c.name)} onClick={() => onToggleFav(c.name)} label={t.favoritos} />
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{c[lang].what}</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">
                      <b className="text-zinc-500 dark:text-zinc-400">{t.conceptUse}:</b> {c[lang].use}
                    </p>
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
