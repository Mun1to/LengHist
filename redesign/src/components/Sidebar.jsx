import { Search, Star, ArrowLeftRight, X } from 'lucide-react'

// El contenido de los filtros vive aparte de la barra lateral porque hace falta
// dos veces: pegado a la izquierda en pantalla ancha y dentro del panel de
// filtros en móvil, donde la barra lateral no cabe.
export function PanelFiltros({ t, searchPh, query, setQuery, categories, activeCat, setActiveCat, extraGroup, onElegir }) {
  return (
    <>
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-tinta-suave" />
        {/* El marcador de posición desaparece al escribir, así que no vale como
            nombre: era el único campo del sitio sin uno. */}
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPh}
          aria-label={searchPh}
          /* El hueco de la derecha solo se reserva cuando hay equis que poner:
             con él siempre puesto, «Filtrar herramientas…» se comía los puntos
             suspensivos contra el borde. */
          className={`w-full bg-panel border border-linea rounded-lg pl-8 py-2 text-sm text-tinta-fuerte placeholder:text-tinta-suave outline-none focus:border-blue-500 ${query ? 'pr-8' : 'pr-3'}`}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-tinta-suave hover:text-tinta cursor-pointer"
            aria-label={t.ariaClearSearch}
          >
            <X size={13} />
          </button>
        )}
      </div>

      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-tinta-suave px-2 mb-1.5">
          {t.categorias}
        </div>
        <div className="flex flex-col gap-0.5">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => { setActiveCat(c.key); onElegir?.() }}
              className={`pulsable flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg text-sm cursor-pointer text-left ${
                activeCat === c.key
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-300 font-semibold'
                  : 'text-tinta-suave hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
            >
              <span className="truncate">{c.label}</span>
              <span className="font-mono text-xs text-tinta-suave shrink-0">{c.count}</span>
            </button>
          ))}
        </div>
      </div>

      {extraGroup && (
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-tinta-suave px-2 mb-1.5">
            {t.tuSeleccion}
          </div>
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => { extraGroup.onToggleFavOnly(); onElegir?.() }}
              className={`pulsable flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm cursor-pointer ${
                extraGroup.showFavOnly
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-300 font-semibold'
                  : 'text-tinta-suave hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
            >
              <Star size={14} fill={extraGroup.showFavOnly ? 'currentColor' : 'none'} /> {t.favoritos}
              <span className="ml-auto font-mono text-xs text-tinta-suave">{extraGroup.favCount}</span>
            </button>
            {extraGroup.compareCount != null && (
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-tinta-suave">
                <ArrowLeftRight size={14} /> {t.comparar}
                <span className="ml-auto font-mono text-xs text-tinta-suave">{extraGroup.compareCount}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default function Sidebar(props) {
  return (
    <aside className="hidden lg:flex flex-col gap-6 w-[250px] shrink-0 border-r border-linea px-4 py-6 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">
      <PanelFiltros {...props} />
    </aside>
  )
}
