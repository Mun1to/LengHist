import { ChevronDown } from 'lucide-react'

// El botón que descubre el tramo siguiente. Dice cuántas fichas quedan, porque
// «Ver más» a secas no deja saber si falta una o setenta y seis.
export default function VerMas({ quedan, onMas, etiqueta }) {
  if (quedan <= 0) return null
  return (
    <div className="flex justify-center pt-8">
      <button
        onClick={onMas}
        className="pulsable alzable inline-flex items-center gap-2 min-h-11 px-5 rounded-full border border-linea bg-panel text-sm font-semibold text-tinta-fuerte hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
      >
        {etiqueta(quedan)}
        <ChevronDown size={15} />
      </button>
    </div>
  )
}
