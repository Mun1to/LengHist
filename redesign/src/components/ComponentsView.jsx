import { useEffect, useRef, useState } from 'react'
import EmptyState from './EmptyState'
import FavButton from './FavButton'
import ComponentDemo from './ComponentDemo'

// Cada demo se monta al acercarse a la pantalla y se suelta al alejarse:
// así se ven todas vivas sin tener seis contextos WebGL abiertos a la vez.
function useNearViewport(ref) {
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: '300px' })
    io.observe(el)
    return () => io.disconnect()
  }, [ref])

  return near
}

function Card({ t, lang, item, values, onOpen, fav, onToggleFav }) {
  const ref = useRef(null)
  const live = useNearViewport(ref)
  const press = useRef(null)

  // La tarjeta entera abre la ficha, pero sin capa invisible por encima: la demo
  // necesita recibir el ratón. Y si el usuario arrastra (orbitar el 3D, rozar la
  // tela), eso no cuenta como clic.
  const onPointerDown = (e) => { press.current = { x: e.clientX, y: e.clientY } }
  const onClick = (e) => {
    if (e.target.closest('[data-no-open]')) return
    const p = press.current
    if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 6) return
    onOpen()
  }

  return (
    <div className="scroll-mt-20">
      <div
        ref={ref}
        onPointerDown={onPointerDown}
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-label={item.name}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen() } }}
        className="group relative h-56 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 cursor-pointer hover:border-zinc-600 focus-visible:border-indigo-500 outline-none transition-colors"
      >
        {live && <ComponentDemo item={item} values={values} lang={lang} compact t={t} />}
        <div className="absolute top-2 right-2 z-20" data-no-open>
          <FavButton active={fav} onClick={onToggleFav} label={t.favoritos} floating />
        </div>
      </div>
      <button onClick={onOpen} className="flex items-center justify-between gap-3 w-full mt-2.5 px-0.5 cursor-pointer text-left">
        <span className="font-bold text-sm text-zinc-900 dark:text-zinc-50">{item.name}</span>
        <span className="font-mono text-[11px] text-zinc-400 truncate">{item.tag[lang]}</span>
      </button>
    </div>
  )
}

export default function ComponentsView({ t, lang, items, onClear, favorites, onToggleFav, values, onOpen }) {
  return (
    <section className="px-6 sm:px-10 py-12 max-w-5xl">
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <h1 className="text-3xl font-extrabold tracking-tight">{t.compTitle}</h1>
        <span className="font-mono text-xs text-zinc-400 shrink-0">{items.length}</span>
      </div>
      <p className="text-zinc-500 dark:text-zinc-400 mb-10">{t.compSub}</p>

      {items.length === 0 ? (
        <EmptyState t={t} onClear={onClear} />
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {items.map((c) => (
            <Card
              key={c.key}
              t={t} lang={lang} item={c} values={values[c.key]}
              onOpen={() => onOpen(c.key)}
              fav={favorites.has(c.key)}
              onToggleFav={() => onToggleFav(c.key)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
