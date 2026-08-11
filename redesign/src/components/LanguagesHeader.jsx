import { HERO_PILLS } from '../data/languages'

// Encabezado de la sección: el hero grande vive ahora en la portada, aquí
// basta con el título y los filtros rápidos.
export default function LanguagesHeader({ t, lang, filter, setFilter, total, shown }) {
  const activo = (f) => {
    if (f.type === 'all') return filter.type === 'all'
    if (f.type === 'cat') return filter.type === 'cat' && filter.value === f.value
    if (f.type === 'fame') return filter.type === 'fame' && filter.value === f.value
    if (f.type === 'recent') return filter.type === 'recent'
    return false
  }

  return (
    <section className="px-6 sm:px-10 pt-12 pb-6">
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <h1 className="text-3xl font-extrabold tracking-tight">{t.gridTitle}</h1>
        <span className="font-mono text-xs text-zinc-400 shrink-0">{t.gridSub(shown, total)}</span>
      </div>
      <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-2xl">{t.langsSub}</p>

      <div className="flex flex-wrap items-center gap-5 pt-5 border-t border-zinc-200 dark:border-zinc-800">
        {HERO_PILLS.map((p) => (
          <button
            key={p.label[lang]}
            onClick={() => setFilter(p.filter)}
            className={`font-mono text-sm pb-0.5 border-b cursor-pointer transition-colors ${
              activo(p.filter)
                ? 'text-indigo-600 dark:text-indigo-300 font-bold border-indigo-500'
                : 'text-zinc-400 dark:text-zinc-500 border-transparent hover:text-zinc-600 dark:hover:text-zinc-300'
            }`}
          >
            {p.label[lang]}
          </button>
        ))}
      </div>
    </section>
  )
}
