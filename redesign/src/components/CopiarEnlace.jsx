import { useState } from 'react'
import { Check, Link2 } from 'lucide-react'

// Cada ficha tiene su dirección propia, así que tiene que poder copiarse sin ir
// a la barra del navegador: es lo que se pega en un chat para enseñar algo.
export default function CopiarEnlace({ t }) {
  const [copiado, setCopiado] = useState(false)

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1600)
    } catch { setCopiado(false) }
  }

  return (
    <button
      onClick={copiar}
      title={t.enlaceCopiar}
      className="pulsable inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-linea text-xs font-medium text-tinta-suave hover:text-tinta hover:border-linea-viva cursor-pointer"
    >
      {copiado ? <Check size={13} className="text-esmeralda brinca" /> : <Link2 size={13} />}
      <span className="hidden sm:inline">{copiado ? t.enlaceCopiado : t.enlaceCopiar}</span>
    </button>
  )
}
