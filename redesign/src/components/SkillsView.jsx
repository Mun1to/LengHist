import { motion } from 'framer-motion'
import { useRef } from 'react'
import EmptyState from './EmptyState'
import FavButton from './FavButton'
import { slugOf } from '../data/skills'

// Tarjeta clicable entera, como en Componentes: si el usuario estaba
// seleccionando texto y arrastró, no se abre la ficha.
function Tarjeta({ t, lang, item, fav, onToggleFav, onOpen, delay }) {
  const press = useRef(null)
  const d = item[lang]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
      onPointerDown={(e) => { press.current = { x: e.clientX, y: e.clientY } }}
      onClick={(e) => {
        if (e.target.closest('[data-no-open]')) return
        const p = press.current
        if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 6) return
        onOpen()
      }}
      className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-colors"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="font-bold text-sm text-zinc-900 dark:text-zinc-50 min-w-0 flex-1">{d.label}</span>
        <span data-no-open>
          <FavButton active={fav} onClick={onToggleFav} label={t.favoritos} />
        </span>
      </div>

      <div className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 mb-2">/{slugOf(item, lang)}</div>

      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{d.what}</p>
      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">
        <b className="text-zinc-500 dark:text-zinc-400">{t.skillWhen}:</b> {d.when}
      </p>
    </motion.div>
  )
}

export default function SkillsView({ t, lang, groups, onClear, favorites, onToggleFav, onOpen }) {
  const total = groups.reduce((n, g) => n + g.items.length, 0)
  // El árbol de ejemplo usa una skill real de la lista, con su nombre en el
  // idioma que se está leyendo.
  const muestra = groups[0]?.items[0]
  const ejemplo = muestra ? slugOf(muestra, lang) : 'check-on-mobile'

  return (
    <section className="px-6 sm:px-10 py-12 max-w-[1800px] mx-auto">
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <h1 className="text-3xl font-extrabold tracking-tight">{t.skillsTitle}</h1>
        <span className="font-mono text-xs text-zinc-400 shrink-0">{total}</span>
      </div>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-2xl leading-relaxed">{t.skillsSub}</p>

      {/* Explicación corta: la mayoría de quien llega aquí no sabe todavía qué es una skill. */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 mb-10">
        <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
          {t.skillsWhatTitle}
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl">{t.skillsWhatText}</p>
        <pre className="mt-4 font-mono text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400 overflow-x-auto">
{`~/.claude/skills/
└── ${ejemplo}/
    └── SKILL.md      ${t.skillsWhatFile}`}
        </pre>
      </div>

      {groups.length === 0 ? (
        <EmptyState t={t} onClear={onClear} />
      ) : (
        <div className="flex flex-col gap-9">
          {groups.map((group, gi) => (
            <div key={group.key} className="scroll-mt-20">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-3">
                {group.label[lang]}
              </h2>
              <div className="grid sm:grid-cols-2 2xl:grid-cols-3 gap-3 items-start">
                {group.items.map((item, i) => (
                  <Tarjeta
                    key={item.key}
                    t={t} lang={lang} item={item}
                    fav={favorites.has(item.key)}
                    onToggleFav={() => onToggleFav(item.key)}
                    onOpen={() => onOpen(item.key)}
                    delay={Math.min(gi * 0.04 + i * 0.02, 0.3)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
