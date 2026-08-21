import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeftRight } from 'lucide-react'
import EmptyState from './EmptyState'
import FavButton from './FavButton'
import { rutaDe, slugLenguaje } from '../lib/rutas'
import VerMas from './VerMas'
import { Encuadre, Reticula } from './Plano'

// Cada tarjeta es un enlace de verdad, no un div que escucha clics: se abre en
// otra pestaña con el botón central, se copia con el derecho y los buscadores
// pueden seguirlo. Lo que va dentro (favorito, comparar) son botones aparte.
export default function LanguageGrid({ t, lang, list, favorites, onToggleFav, compareSet, onToggleCompare, onClearFilters, quedan = 0, onVerMas }) {
  if (list.length === 0) return (
    <section id="grid" className="px-6 sm:px-10 pt-2 pb-10">
      <EmptyState t={t} onClear={onClearFilters} />
    </section>
  )

  return (
    <section id="grid" className="px-6 sm:px-10 pt-2 pb-10">
      {/* Al filtrar ya no se anima la reordenación: con `layout` y
          `AnimatePresence`, cada ficha viajaba a su sitio nuevo por su cuenta,
          y con cien fichas eso son veinte trayectos cruzándose a la vez. */}
      <Reticula cols="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {list.map((l, i) => (
          <motion.article
            key={l.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.22, delay: Math.min(i, 12) * 0.02 }}
            // En columna y con el pie anclado abajo: las fichas de una fila
            // miden lo mismo, así que si el pie va detrás del texto queda a una
            // altura distinta en cada una y la fila se lee torcida aunque las
            // cajas estén alineadas.
            className="group relative flex flex-col bg-panel border border-linea hover:border-linea-viva transition-colors"
          >
            <Encuadre suave />
            <Link to={rutaDe('languages', slugLenguaje(l.name), lang)} className="pulsable pulsable-suave block p-4 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500">
              {/* El color del lenguaje se queda en una barra fina: identifica
                  igual que la cabecera de degradado y no se come la tarjeta. */}
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="w-1 h-4 shrink-0" style={{ background: l.color[0] }} />
                <h2 className="font-bold text-tinta truncate min-w-0 flex-1">{l.name}</h2>
                <span className="font-mono text-[12px] text-tinta-suave shrink-0">{l.year}</span>
              </div>
              {/* Tres líneas y no dos: con dos, cuatro de cada diez fichas se
                  cortaban a mitad de frase y el resumen dejaba de resumir. */}
              <p className="text-sm text-tinta-suave leading-snug line-clamp-3">{l[lang].desc}</p>
              <div className="font-mono text-[12px] text-tinta-suave mt-2.5 truncate">
                {l.extensions.slice(0, 3).join(' ')}
              </div>
            </Link>

            <div className="flex items-center justify-between gap-2 px-4 pb-3 pt-2 mt-auto">
              <button
                onClick={() => onToggleCompare(l.name)}
                /* La estrella de al lado mide 28px: igualando el alto aquí, el
                     área pulsable pasa de 16px a 28 sin que la fila crezca ni un
                     píxel. Antes había cien botones por debajo del mínimo. */
                className={`inline-flex items-center gap-1.5 min-h-7 px-1.5 -mx-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                  compareSet.has(l.name)
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-tinta-suave hover:text-tinta'
                }`}
              >
                <ArrowLeftRight size={11} /> {t.comparar}
              </button>
              <FavButton active={favorites.has(l.name)} onClick={() => onToggleFav(l.name)} label={t.favoritos} />
            </div>
          </motion.article>
        ))}
      </Reticula>
      <VerMas quedan={quedan} onMas={onVerMas} etiqueta={t.verMas} />
    </section>
  )
}
