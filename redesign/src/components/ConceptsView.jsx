import { motion } from 'framer-motion'
import EmptyState from './EmptyState'
import FavButton from './FavButton'
import { CONCEPT_EXAMPLES } from '../data/conceptExamples'
import { CONCEPT_EXAMPLES_EN } from '../data/conceptExamplesEn'
import ConceptDemo from './ConceptDemo'
import CodeSample from './CodeSample'

export default function ConceptsView({ t, lang, groups, onClear, favorites, onToggleFav }) {
  const total = groups.reduce((n, g) => n + g.items.length, 0)
  // El nombre del concepto es la clave interna (favoritos, ejemplos): solo
  // unos pocos cambian al traducirse, y esos traen nameEn y tagEn.
  const ejemplos = lang === 'en' ? CONCEPT_EXAMPLES_EN : CONCEPT_EXAMPLES

  // La rejilla usa el ancho que haya, como ya hacía la de Lenguajes: estaba
  // capada a 1024px y en una pantalla ancha sobraba media página a la derecha.
  // El tope solo entra en monitores enormes, para que la tarjeta no crezca sin
  // final; la tercera columna, cuando cabe con el código cómodo.
  return (
    <section className="px-6 sm:px-10 py-12 max-w-[1800px] mx-auto">
      <div className="flex items-baseline justify-between gap-4 mb-2 max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight">{t.conceptsTitle}</h1>
        <span className="font-mono text-xs text-zinc-400 shrink-0">{total}</span>
      </div>
      <p className="text-zinc-500 dark:text-zinc-400 mb-10 max-w-2xl">{t.conceptsSub}</p>

      {groups.length === 0 ? (
        <EmptyState t={t} onClear={onClear} />
      ) : (
        <div className="flex flex-col gap-9">
          {groups.map((group) => (
            <div key={group.key} className="scroll-mt-20">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-3">
                {group.label[lang]}
              </h2>
              <div className="grid sm:grid-cols-2 2xl:grid-cols-3 gap-3 items-start">
                {group.items.map((c, i) => (
                  <motion.div
                    key={c.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min((i % 6) * 0.03, 0.2) }}
                    className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-bold text-sm text-zinc-900 dark:text-zinc-50 min-w-0 flex-1">
                        {lang === 'en' && c.nameEn ? c.nameEn : c.name}
                      </span>
                      <span className="font-mono text-[11px] shrink-0" style={{ color: group.color }}>
                        {lang === 'en' && c.tagEn ? c.tagEn : c.tag}
                      </span>
                      <FavButton active={favorites.has(c.name)} onClick={() => onToggleFav(c.name)} label={t.favoritos} />
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{c[lang].what}</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">
                      <b className="text-zinc-500 dark:text-zinc-400">{t.conceptUse}:</b> {c[lang].use}
                    </p>
                    <ConceptDemo nombre={c.name} etiqueta={t.conceptDemo} lang={lang} />
                    <CodeSample t={t} etiqueta={t.conceptExample} bloques={ejemplos[c.name]} />
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
