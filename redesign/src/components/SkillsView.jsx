import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import EmptyState from './EmptyState'
import FavButton from './FavButton'
import BotonCopiar from './BotonCopiar'
import CodeBlock from './CodeBlock'
import { Reticula } from './Plano'
import { authorOf, hasOwnRepo, MERCADO, repoLabel, skillFile, slugOf } from '../data/skills'
import { rutaDe, slugClave } from '../lib/rutas'
import { TOTALES } from '../lib/totales'

// Tarjeta clicable entera, como en Componentes: si el usuario estaba
// seleccionando texto y arrastró, no se abre la ficha.
function Tarjeta({ t, lang, item, fav, onToggleFav, delay }) {
  const press = useRef(null)
  const d = item[lang]
  const irA = useNavigate()
  const onOpen = () => irA(rutaDe('skills', slugClave(item.key)))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, delay }}
      onPointerDown={(e) => { press.current = { x: e.clientX, y: e.clientY } }}
      onClick={(e) => {
        if (e.target.closest('[data-no-open]')) return
        const p = press.current
        if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 6) return
        onOpen()
      }}
      className="pulsable pulsable-suave flex flex-col bg-panel border border-linea p-4 cursor-pointer hover:border-linea-viva"
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

      <div className="font-mono text-[12px] text-blue-600 dark:text-blue-400 mb-2">/{slugOf(item, lang)}</div>

      <p className="text-sm text-tinta-suave leading-relaxed">{d.what}</p>
      <p className="text-xs text-tinta-suave mt-2">
        <b className="text-tinta-suave">{t.skillWhen}:</b> {d.when}
      </p>

      {/* Crédito en la propia tarjeta, sin enlace: la tarjeta entera ya es
          clicable y un enlace dentro competiría con ella. */}
      <div className="flex items-center gap-2 mt-auto pt-2.5 border-t border-linea/60 text-[12px] text-tinta-suave">
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
  // Y el comando de instalación se escribe con una skill que de verdad se
  // publica como plugin, no con un nombre de mentira: el segundo comando pide
  // uno concreto y copiarlo tiene que funcionar.
  const conPlugin = groups.flatMap((g) => g.items).find((s) => s.plugin)

  return (
    <section className="px-6 sm:px-10 py-12 max-w-[1800px] mx-auto">
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <h1 className="text-3xl font-extrabold tracking-tight">{t.skillsTitle}</h1>
        <span className="font-mono text-xs text-tinta-suave shrink-0">{t.deTotal(total)}</span>
      </div>
      <p className="text-tinta-suave mb-8 max-w-2xl leading-relaxed">{t.skillsSub}</p>

      {/* Explicación corta: la mayoría de quien llega aquí no sabe todavía qué
          es una skill. Va en dos columnas y no apilado, porque son dos cosas
          distintas: a la izquierda qué es, a la derecha cómo se instala. En una
          sola columna, el comando quedaba al final de un párrafo largo y con
          media pantalla vacía a su derecha; y lo accionable no se esconde
          debajo de la teoría. La línea que las separa es la de la retícula. */}
      <div className="border border-linea bg-panel/50 mb-10 grid lg:grid-cols-2">
        <div className="p-5">
          <div className="text-[12px] font-bold uppercase tracking-wider text-tinta-suave mb-2">
            {t.skillsWhatTitle}
          </div>
          <p className="text-sm text-tinta-fuerte leading-relaxed">{t.skillsWhatText}</p>
          <pre className="mt-4 font-mono text-[12px] leading-relaxed text-tinta-suave overflow-x-auto">
{`~/.claude/skills/
└── ${ejemplo}/
    └── SKILL.md      ${t.skillsWhatFile}`}
          </pre>
        </div>
        <div className="p-5 border-t border-linea lg:border-t-0 lg:border-l">
          <div className="text-[12px] font-bold uppercase tracking-wider text-tinta-suave mb-2">
            {t.skillInstall}
          </div>
          <p className="text-sm text-tinta-fuerte leading-relaxed">
            {t.skillMarketplace(TOTALES.skillsPlugin)}
          </p>
          <div className="mt-4">
            <CodeBlock
              t={t}
              title="claude code"
              code={`/plugin marketplace add ${MERCADO}${conPlugin ? `
/plugin install ${conPlugin.plugin}` : ''}`}
            />
          </div>
        </div>
      </div>

      {groups.length === 0 ? (
        <EmptyState t={t} onClear={onClear} />
      ) : (
        <div className="flex flex-col gap-9">
          {groups.map((group, gi) => (
            <div key={group.key} className="scroll-mt-20">
              <h2 className="text-[12px] font-bold uppercase tracking-wider text-tinta-suave mb-3">
                {group.label[lang]}
              </h2>
              <Reticula cols="sm:grid-cols-2 xl:grid-cols-3">
                {group.items.map((item, i) => (
                  <Tarjeta
                    key={item.key}
                    t={t} lang={lang} item={item}
                    fav={favorites.has(item.key)}
                    onToggleFav={() => onToggleFav(item.key)}
                    delay={Math.min(gi * 0.04 + i * 0.02, 0.3)}
                  />
                ))}
              </Reticula>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
