import { useEffect, useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { PanelFiltros } from './Sidebar'

// Por debajo de 1024 la barra lateral se esconde y con ella se iban las
// categorías y el buscador de la sección: quedaba un catálogo de cien fichas sin
// una sola forma de acotarlo. Aquí vuelven, en un panel que se abre a demanda.
export default function FiltrosMovil({ t, ...props }) {
  const [abierto, setAbierto] = useState(false)

  useEffect(() => {
    if (!abierto) return
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const tecla = (e) => { if (e.key === 'Escape') setAbierto(false) }
    window.addEventListener('keydown', tecla)
    return () => {
      document.body.style.overflow = previo
      window.removeEventListener('keydown', tecla)
    }
  }, [abierto])

  // Cuántos filtros hay puestos, para que el botón lo diga sin abrirlo.
  const activos = (props.query ? 1 : 0)
    + (props.activeCat && props.activeCat !== 'all' ? 1 : 0)
    + (props.extraGroup?.showFavOnly ? 1 : 0)

  return (
    <div className="lg:hidden">
      <div className="px-6 pt-5">
        <button
          onClick={() => setAbierto(true)}
          className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-semibold text-zinc-700 dark:text-zinc-200 cursor-pointer"
        >
          <SlidersHorizontal size={14} />
          {t.filtros}
          {activos > 0 && (
            <span className="grid place-items-center min-w-5 h-5 px-1 rounded-full bg-indigo-600 text-white font-mono text-[11px]">
              {activos}
            </span>
          )}
        </button>
      </div>

      {abierto && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
          <div className="flex items-center justify-between gap-4 px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">
            <span className="font-bold">{t.filtros}</span>
            <button
              onClick={() => setAbierto(false)}
              aria-label={t.cerrar}
              className="grid place-items-center w-9 h-9 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex flex-col gap-6 px-6 py-6 overflow-y-auto">
            <PanelFiltros t={t} {...props} onElegir={() => setAbierto(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
