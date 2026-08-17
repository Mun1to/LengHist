import { Star } from 'lucide-react'

export default function FavButton({ active, onClick, label, floating = false }) {
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClick() }}
      aria-label={label}
      title={label}
      className={
        floating
          ? 'pulsable absolute top-2.5 right-2.5 w-7 h-7 grid place-items-center rounded-lg bg-black/25 backdrop-blur-sm text-white hover:bg-black/40 cursor-pointer z-10'
          : `pulsable shrink-0 w-7 h-7 grid place-items-center rounded-lg cursor-pointer ${
              active
                ? 'text-ambar'
                : 'text-tinta-suave hover:text-ambar'
            }`
      }
    >
      {/* La estrella brinca al marcarse, no al desmarcarse: la key solo cambia
          cuando pasa a activa. */}
      <Star
        key={active ? 'on' : 'off'}
        size={14}
        fill={active ? 'currentColor' : 'none'}
        className={`${active ? 'brinca' : ''} ${floating && active ? 'text-amber-300' : ''}`}
      />
    </button>
  )
}
