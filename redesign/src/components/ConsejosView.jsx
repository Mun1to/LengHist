import { Shuffle, Plus, ArrowUpRight } from 'lucide-react'
import EmptyState from './EmptyState'
import FavButton from './FavButton'
import { CONSEJO_GRUPOS, tamanoDe, trozosDe } from '../data/consejos'
import './consejos.css'

// Muro de consejos: mensajes cortos mezclados, no ordenados por bloques. El
// tamaño de cada uno sale de lo que ocupa, así que el muro no queda plano.

function Texto({ texto }) {
  return trozosDe(texto).map((t, i) =>
    t.tipo === 'fuerte' ? <b key={i}>{t.texto}</b>
      : t.tipo === 'codigo' ? <code key={i}>{t.texto}</code>
      : <span key={i}>{t.texto}</span>
  )
}

function Nota({ t, lang, consejo, favorito, onToggleFav }) {
  const texto = consejo[lang] ?? consejo.es
  const grupo = CONSEJO_GRUPOS.find((g) => g.key === consejo.grupo)

  return (
    <div className="cj-nota" data-grupo={consejo.grupo} data-tam={tamanoDe(texto)}>
      <p className="cj-texto text-tinta"><Texto texto={texto} /></p>
      <div className="cj-pie">
        {/* Sin firma cuando el consejo es de la casa: repetir "Vibeset" 38 veces
            es ruido, y así la firma significa que alguien lo puso de su mano. */}
        {consejo.autor && (
          <a
            href={`https://github.com/${consejo.autor}`}
            target="_blank"
            rel="noopener"
            className="font-mono text-tinta-suave hover:text-tinta transition-colors"
          >
            @{consejo.autor}
          </a>
        )}
        <span className="cj-tema">{grupo?.label[lang]}</span>
        <span className="ml-auto">
          <FavButton active={favorito} onClick={() => onToggleFav(consejo.id)} label={t.favoritos} />
        </span>
      </div>
    </div>
  )
}

export default function ConsejosView({
  t, lang, lista, total, favorites, onToggleFav, onClear, onMezclar, urlAportar,
}) {
  return (
    <section className="px-6 sm:px-10 py-12 max-w-[1800px] mx-auto">
      <div className="flex items-baseline justify-between gap-4 mb-2 max-w-3xl">
        <div className="flex items-baseline gap-3 min-w-0">
          <h1 className="text-3xl font-extrabold tracking-tight">{t.consejosTitle}</h1>
          {/* En pruebas: se dice con una palabra, no con una pegatina */}
          <span className="font-mono text-[12px] uppercase tracking-widest text-ambar">
            {t.beta}
          </span>
        </div>
        <span className="font-mono text-xs text-tinta-suave shrink-0">{total}</span>
      </div>
      <p className="text-tinta-suave mb-6 max-w-2xl">{t.consejosSub}</p>

      <div className="flex items-center gap-5 flex-wrap pb-4 mb-6 border-b border-linea">
        <button
          onClick={onMezclar}
          className="inline-flex items-center gap-1.5 min-h-6 pt-1 pb-0.5 text-xs font-semibold text-blue-600 dark:text-blue-300 border-b border-blue-500/40 hover:border-current cursor-pointer transition-colors"
        >
          <Shuffle size={13} />
          {t.consejosMezclar}
        </button>
        <a
          href={urlAportar}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1.5 min-h-6 px-1 -mx-1 text-xs font-semibold text-tinta-suave hover:text-tinta cursor-pointer transition-colors"
        >
          <Plus size={13} />
          {t.consejosAportar}
          <ArrowUpRight size={12} />
        </a>
        <span className="ml-auto font-mono text-[12px] text-tinta-suave">{t.consejosQuienAporta}</span>
      </div>

      {lista.length === 0 ? (
        <EmptyState t={t} onClear={onClear} />
      ) : (
        <div className="cj-muro">
          {lista.map((c) => (
            <Nota key={c.id} t={t} lang={lang} consejo={c}
                  favorito={favorites.has(c.id)} onToggleFav={onToggleFav} />
          ))}
        </div>
      )}
    </section>
  )
}
