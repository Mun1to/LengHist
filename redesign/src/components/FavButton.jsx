import { Star } from 'lucide-react'

export default function FavButton({ active, onClick, label, floating = false }) {
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClick() }}
      aria-label={label}
      title={label}
      className={
        floating
          ? 'absolute top-2.5 right-2.5 w-7 h-7 grid place-items-center rounded-lg bg-black/25 backdrop-blur-sm text-white hover:bg-black/40 cursor-pointer z-10'
          : `shrink-0 w-7 h-7 grid place-items-center rounded-lg cursor-pointer transition-colors ${
              active
                ? 'text-amber-500 dark:text-amber-300'
                : 'text-zinc-300 dark:text-zinc-600 hover:text-amber-500 dark:hover:text-amber-300'
            }`
      }
    >
      <Star size={14} fill={active ? 'currentColor' : 'none'} className={floating && active ? 'text-amber-300' : ''} />
    </button>
  )
}
