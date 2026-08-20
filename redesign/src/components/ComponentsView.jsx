import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import EmptyState from './EmptyState'
import FavButton from './FavButton'
import ComponentDemo from './ComponentDemo'
import { rutaDe, slugClave } from '../lib/rutas'

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

function Card({ t, lang, item, values, fav, onToggleFav }) {
  const ref = useRef(null)
  const live = useNearViewport(ref)
  const press = useRef(null)
  const irA = useNavigate()
  const ruta = rutaDe('components', slugClave(item.key))
  const onOpen = () => irA(ruta)

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
        data-demo
        className="group relative h-56 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 cursor-pointer hover:border-zinc-600 focus-visible:border-blue-500 outline-none transition-colors"
      >
        {live && <ComponentDemo item={item} values={values} lang={lang} compact t={t} />}
        <div className="absolute top-2 right-2 z-20" data-no-open>
          <FavButton active={fav} onClick={onToggleFav} label={t.favoritos} floating />
        </div>
      </div>
      {/* El nombre es el enlace de verdad de la tarjeta: la demo de arriba tiene
          que recibir el ratón, así que no puede ser ella el enlace. */}
      <Link to={ruta} className="flex items-baseline gap-3 min-h-6 py-0.5 mt-2 px-0.5 group/nombre">
        <h2 className="font-bold text-sm text-tinta group-hover/nombre:text-blue-600 dark:group-hover/nombre:text-blue-400 transition-colors shrink-0">
          {item.name}
        </h2>
        <span className="font-mono text-[11px] text-tinta-suave truncate">{item.tag[lang]}</span>
      </Link>
    </div>
  )
}

export default function ComponentsView({ t, lang, items, onClear, favorites, onToggleFav, values }) {
  return (
    <section className="px-6 sm:px-10 py-12 max-w-[1800px] mx-auto">
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <h1 className="text-3xl font-extrabold tracking-tight">{t.compTitle}</h1>
        <span className="font-mono text-xs text-tinta-suave shrink-0">{t.deTotal(items.length)}</span>
      </div>
      <p className="text-tinta-suave mb-10 max-w-2xl">{t.compSub}</p>

      {items.length === 0 ? (
        <EmptyState t={t} onClear={onClear} />
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {items.map((c) => (
            <Card
              key={c.key}
              t={t} lang={lang} item={c} values={values[c.key]}
              fav={favorites.has(c.key)}
              onToggleFav={() => onToggleFav(c.key)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
