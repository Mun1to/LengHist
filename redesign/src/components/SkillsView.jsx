import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import EmptyState from './EmptyState'
import FavButton from './FavButton'
import BotonCopiar from './BotonCopiar'
import CodeBlock from './CodeBlock'
import { authorOf, hasOwnRepo, repoLabel, skillFile, slugOf } from '../data/skills'
import { rutaDe, slugClave } from '../lib/rutas'

// Tarjeta clicable entera, como en Componentes: si el usuario estaba
// seleccionando texto y arrastró, no se abre la ficha.
function Tarjeta({ t, lang, item, fav, onToggleFav, delay }) {
  const press = useRef(null)
  const d = item[lang]
  const irA = useNavigate()
  const onOpen = () => irA(rutaDe('skills', slugClave(item.key)))

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
      className="pulsable pulsable-suave rounded-xl bg-panel border border-linea p-4 cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5"
    >
      <div className="flex items-center gap-1 mb-1">
        <h3 className="font-bold text-sm text-tinta min-w-0 flex-1">{d.label}</h3>
        {/* Copiar el archivo sin entrar en la ficha: quien ya sabe qué skill
            quiere no necesita leerla otra vez. */}
        <span data-no-open className="flex items-center gap-0.5">
          <BotonCopiar texto={skillFile(item, lang)} etiqueta={t.skillCopiarArchivo} compacto />
          <FavButton active={fav} onClick={onToggleFav} label={t.favoritos} />
        </span>
      </div>

      <div className="font-mono text-[11px] text-blue-600 dark:text-blue-400 mb-2">/{slugOf(item, lang)}</div>

      <p className="text-sm text-tinta-suave leading-relaxed">{d.what}</p>
      <p className="text-xs text-tinta-suave mt-2">
        <b className="text-tinta-suave">{t.skillWhen}:</b> {d.when}
      </p>

      {/* Crédito en la propia tarjeta, sin enlace: la tarjeta entera ya es
          clicable y un enlace dentro competiría con ella. */}
      <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-linea/60 text-[11px] text-tinta-suave">
        <span>{t.skillBy} {authorOf(item).name}</span>
        {hasOwnRepo(item) && (
          <>
            <span className="text-tinta-suave">·</span>
            <span className="font-mono break-all">{repoLabel(item)}</span>
          </>
        )}
      </div>
    </motion.div>
  )
}

export default function SkillsView({ t, lang, groups, onClear, favorites, onToggleFav }) {
  const total = groups.reduce((n, g) => n + g.items.length, 0)
  // El árbol de ejemplo usa una skill real de la lista, con su nombre en el
  // idioma que se está leyendo.
  const muestra = groups[0]?.items[0]
  const ejemplo = muestra ? slugOf(muestra, lang) : 'check-on-mobile'

  return (
    <section className="px-6 sm:px-10 py-12 max-w-[1800px] mx-auto">
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <h1 className="text-3xl font-extrabold tracking-tight">{t.skillsTitle}</h1>
        <span className="font-mono text-xs text-tinta-suave shrink-0">{t.deTotal(total)}</span>
      </div>
      <p className="text-tinta-suave mb-8 max-w-2xl leading-relaxed">{t.skillsSub}</p>

      {/* Explicación corta: la mayoría de quien llega aquí no sabe todavía qué es una skill. */}
      <div className="rounded-xl border border-linea bg-panel/50 p-5 mb-10">
        <div className="text-[11px] font-bold uppercase tracking-wider text-tinta-suave mb-2">
          {t.skillsWhatTitle}
        </div>
        <p className="text-sm text-tinta-fuerte leading-relaxed max-w-2xl">{t.skillsWhatText}</p>
        <pre className="mt-4 font-mono text-[11px] leading-relaxed text-tinta-suave overflow-x-auto">
{`~/.claude/skills/
└── ${ejemplo}/
    └── SKILL.md      ${t.skillsWhatFile}`}
        </pre>
        <p className="text-sm text-tinta-suave mt-4 max-w-2xl leading-relaxed">
          {t.skillMarketplace}
        </p>
        <div className="mt-3 max-w-xl">
          <CodeBlock t={t} title="claude code" code={`/plugin marketplace add Mun1to/Vibeset`} />
        </div>
      </div>

      {groups.length === 0 ? (
        <EmptyState t={t} onClear={onClear} />
      ) : (
        <div className="flex flex-col gap-9">
          {groups.map((group, gi) => (
            <div key={group.key} className="scroll-mt-20">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-tinta-suave mb-3">
                {group.label[lang]}
              </h2>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 items-start">
                {group.items.map((item, i) => (
                  <Tarjeta
                    key={item.key}
                    t={t} lang={lang} item={item}
                    fav={favorites.has(item.key)}
                    onToggleFav={() => onToggleFav(item.key)}
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
