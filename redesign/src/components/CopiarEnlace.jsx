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
      className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 cursor-pointer transition-colors"
    >
      {copiado ? <Check size={13} /> : <Link2 size={13} />}
      <span className="hidden sm:inline">{copiado ? t.enlaceCopiado : t.enlaceCopiar}</span>
    </button>
  )
}
