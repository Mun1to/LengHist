import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

// Copiar sin abrir la ficha. Es lo que hacen todas las galerías de componentes
// que están en el catálogo de Recursos, y por una razón: quien ya sabe lo que
// busca no quiere leer la ficha, quiere el texto en el portapapeles.
export default function BotonCopiar({ texto, etiqueta, etiquetaHecho, compacto = false }) {
  const [copiado, setCopiado] = useState(false)

  const copiar = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1600)
    } catch { setCopiado(false) }
  }

  return (
    <button
      onClick={copiar}
      title={etiqueta}
      aria-label={etiqueta}
      className={`pulsable inline-flex items-center gap-1.5 rounded-lg text-tinta-suave hover:text-tinta cursor-pointer ${
        compacto ? 'w-7 h-7 justify-center' : 'h-8 px-2.5 border border-linea text-xs font-medium hover:border-linea-viva'
      }`}
    >
      {copiado ? <Check size={13} className="text-esmeralda brinca" /> : <Copy size={13} />}
      {!compacto && <span>{copiado ? etiquetaHecho : etiqueta}</span>}
    </button>
  )
}
