import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import EmptyState from './EmptyState'
import FavButton from './FavButton'
import { Reticula } from './Plano'

// Un directorio se lee por la marca, así que cada herramienta necesita un ancla
// visual. No se traen los favicons de fuera a propósito: serían 64 peticiones a
// 64 dominios ajenos que delatarían a quien mira la página, y aquí se promete
// que nada sale de tu navegador. El monograma con el color de su categoría hace
// el mismo trabajo de orientar la vista y no cuesta ninguna petición.
function Monograma({ nombre, color }) {
  const letras = nombre.replace(/^https?:\/\//, '').slice(0, 2)
  return (
    <span
      aria-hidden="true"
      className="grid place-items-center w-9 h-9 shrink-0 font-mono text-xs font-bold uppercase"
      style={{ background: `color-mix(in srgb, ${color} 12%, transparent)`, color }}
    >
      {letras}
    </span>
  )
}

const dominio = (url) => {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return '' }
}

export default function ResourcesView({ t, lang, groups, onClear, favorites, onToggleFav }) {
  const total = groups.reduce((n, g) => n + g.items.length, 0)

  return (
    <section className="px-6 sm:px-10 py-12 max-w-[1800px] mx-auto">
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <h1 className="text-3xl font-extrabold tracking-tight">{t.resTitle}</h1>
        <span className="font-mono text-xs text-tinta-suave shrink-0">{t.deTotal(total)}</span>
      </div>
      <p className="text-tinta-suave mb-10 max-w-2xl">{t.resSub}</p>

      {groups.length === 0 ? (
        <EmptyState t={t} onClear={onClear} />
      ) : (
        <div className="flex flex-col gap-9">
          {groups.map((group, gi) => (
            <div key={group.key} className="scroll-mt-20">
              <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-tinta-suave mb-3">
                <span className="w-1.5 h-1.5" style={{ background: group.dot }} />
                {group.label[lang]}
              </h2>
              <Reticula cols="sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {group.items.map((r, i) => (
                  <motion.a
                    key={r.name}
                    href={r.url}
                    target="_blank"
                    rel="noopener"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25, delay: Math.min(gi * 0.04 + i * 0.02, 0.3) }}
                    className="group pulsable pulsable-suave flex items-stretch gap-3 bg-panel border border-linea p-3.5 hover:border-linea-viva"
                  >
                    <Monograma nombre={r.name} color={group.dot} />
                    <div className="min-w-0 flex-1 flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-sm text-tinta truncate">{r.name}</h3>
                        <ArrowUpRight size={13} className="shrink-0 text-tinta-suave group-hover:text-blue-500 transition-colors" />
                      </div>
                      <div className="text-sm text-tinta-suave leading-snug mt-0.5">{r[lang]}</div>
                      {/* A dónde te lleva, dicho antes de pulsar. Anclado abajo:
                          en una retícula, las fichas de una fila miden lo mismo
                          y un dominio que sigue al texto sale a una altura por
                          ficha según cuántas líneas ocupe la descripción. */}
                      <div className="font-mono text-[11px] text-tinta-suave truncate mt-auto pt-1.5">
                        {dominio(r.url)}
                      </div>
                    </div>
                    <span onClick={(e) => { e.preventDefault(); e.stopPropagation() }}>
                      <FavButton active={favorites.has(r.name)} onClick={() => onToggleFav(r.name)} label={t.favoritos} />
                    </span>
                  </motion.a>
                ))}
              </Reticula>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
