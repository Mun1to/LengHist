import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import EmptyState from './EmptyState'
import FavButton from './FavButton'

function Tile({ title, tag, children, fav, onToggleFav, favLabel }) {
  return (
    <div className="scroll-mt-20">
      <div className="relative h-56 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800">
        {children}
        <FavButton active={fav} onClick={onToggleFav} label={favLabel} floating />
      </div>
      <div className="flex items-center justify-between mt-2.5 px-0.5">
        <span className="font-bold text-sm text-zinc-900 dark:text-zinc-50">{title}</span>
        <span className="font-mono text-[11px] text-zinc-400">{tag}</span>
      </div>
    </div>
  )
}

function LaserTile({ title, tag, lang, ...fav }) {
  return (
    <Tile title={title} tag={tag} {...fav}>
      <div className="absolute inset-0 flex items-center justify-center text-zinc-600 text-sm font-mono">
        {lang === 'es' ? 'divisor bajo el hero' : 'divider under the hero'}
      </div>
      <motion.div
        className="absolute left-0 right-0 h-[2px]"
        style={{ top: '50%', background: 'linear-gradient(90deg, transparent, #a5b4fc, #67e8f9, #a5b4fc, transparent)' }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-0 right-0 h-16 -translate-y-1/2"
        style={{ top: '50%', background: 'radial-gradient(closest-side, rgba(129,140,248,.35), transparent 70%)' }}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </Tile>
  )
}

function BubbleTile({ title, tag, lang, ...fav }) {
  const ref = useRef(null)
  const mx = useMotionValue(120)
  const my = useMotionValue(110)
  const sx = useSpring(mx, { stiffness: 200, damping: 18 })
  const sy = useSpring(my, { stiffness: 200, damping: 18 })

  return (
    <Tile title={title} tag={tag} {...fav}>
      <div
        ref={ref}
        className="absolute inset-0 grid place-items-center text-zinc-600 text-sm font-mono cursor-none"
        onMouseMove={(e) => {
          const r = ref.current.getBoundingClientRect()
          mx.set(e.clientX - r.left)
          my.set(e.clientY - r.top)
        }}
      >
        {lang === 'es' ? 'mueve el cursor aquí' : 'move your cursor here'}
        <motion.div
          className="absolute w-11 h-11 rounded-full pointer-events-none"
          style={{
            left: sx, top: sy, x: '-50%', y: '-50%',
            background: 'rgba(129,140,248,.16)', backdropFilter: 'blur(3px) saturate(1.5)',
            border: '1px solid rgba(199,210,254,.4)', boxShadow: '0 4px 18px rgba(129,140,248,.35)',
          }}
        >
          <div className="absolute top-[14%] left-[18%] w-[30%] h-[30%] rounded-full bg-white/60 blur-[2px]" />
        </motion.div>
      </div>
    </Tile>
  )
}

function PeelTile({ title, tag, lang, ...fav }) {
  const [hover, setHover] = useState(false)
  return (
    <Tile title={title} tag={tag} {...fav}>
      <div
        className="absolute inset-0 grid place-items-center text-zinc-600 text-sm font-mono"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {lang === 'es' ? 'pasa el cursor' : 'hover here'}
        <motion.div
          className="absolute top-0 right-0 w-14 h-14 origin-top-right"
          style={{ background: 'linear-gradient(135deg, #27272a 50%, #52525b 50%)', clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
          animate={{ rotate: hover ? -18 : 0, x: hover ? -4 : 0, y: hover ? 3 : 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          initial={false}
          animate={{ opacity: hover ? 1 : 0, y: hover ? 0 : -8 }}
          transition={{ duration: 0.25 }}
          className="absolute top-3 right-3 w-32 rounded-lg bg-zinc-900 border border-zinc-700 p-2.5 text-left"
        >
          <div className="font-mono text-xs text-indigo-300 font-bold">98/100</div>
          <div className="text-[11px] text-zinc-400 mt-1">+ {lang === 'es' ? 'Sintaxis muy legible' : 'Very readable syntax'}</div>
        </motion.div>
      </div>
    </Tile>
  )
}

function ParticleTile({ title, tag, ...fav }) {
  return (
    <Tile title={title} tag={tag} {...fav}>
      <div className="absolute inset-0 grid place-items-center">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, margin: '-20% 0px' }}
          className="flex font-extrabold text-3xl text-zinc-100"
        >
          {'Vibeset'.split('').map((ch, i) => (
            <motion.span
              key={i}
              variants={{ hidden: { opacity: 0, y: 14, filter: 'blur(4px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)' } }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              {ch}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </Tile>
  )
}

const TILES = { laser: LaserTile, bubble: BubbleTile, peel: PeelTile, particle: ParticleTile }

export default function ComponentsView({ t, lang, items, onClear, favorites, onToggleFav }) {
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
          {items.map((c) => {
            const Comp = TILES[c.key]
            return (
              <Comp
                key={c.key}
                title={c.name}
                tag={c.tag[lang]}
                lang={lang}
                fav={favorites.has(c.key)}
                onToggleFav={() => onToggleFav(c.key)}
                favLabel={t.favoritos}
              />
            )
          })}
        </div>
      )}
    </section>
  )
}
