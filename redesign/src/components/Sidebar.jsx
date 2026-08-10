import { Search, Star, ArrowLeftRight, X } from 'lucide-react'

export default function Sidebar({
  t,
  searchPh,
  query,
  setQuery,
  categories,
  activeCat,
  setActiveCat,
  extraGroup,
}) {
  return (
    <aside className="hidden lg:flex flex-col gap-6 w-[250px] shrink-0 border-r border-zinc-200 dark:border-zinc-800 px-4 py-6 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          id="sidebarSearch"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPh}
          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-8 pr-8 py-2 text-sm text-zinc-700 dark:text-zinc-200 placeholder:text-zinc-400 outline-none focus:border-indigo-500"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
            aria-label="Limpiar búsqueda"
          >
            <X size={13} />
          </button>
        )}
      </div>

      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-2 mb-1.5">
          {t.categorias}
        </div>
        <div className="flex flex-col gap-0.5">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveCat(c.key)}
              className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg text-sm cursor-pointer transition-colors text-left ${
                activeCat === c.key
                  ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
            >
              <span className="flex items-center gap-2 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.dot }} />
                <span className="truncate">{c.label}</span>
              </span>
              <span className="font-mono text-xs text-zinc-400 shrink-0">{c.count}</span>
            </button>
          ))}
        </div>
      </div>

      {extraGroup && (
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-2 mb-1.5">
            {t.tuSeleccion}
          </div>
          <div className="flex flex-col gap-0.5">
            <button
              onClick={extraGroup.onToggleFavOnly}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm cursor-pointer transition-colors ${
                extraGroup.showFavOnly
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-300 font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
            >
              <Star size={14} fill={extraGroup.showFavOnly ? 'currentColor' : 'none'} /> {t.favoritos}
              <span className="ml-auto font-mono text-xs text-zinc-400">{extraGroup.favCount}</span>
            </button>
            {extraGroup.compareCount != null && (
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-zinc-600 dark:text-zinc-400">
                <ArrowLeftRight size={14} /> {t.comparar}
                <span className="ml-auto font-mono text-xs text-zinc-400">{extraGroup.compareCount}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  )
}
