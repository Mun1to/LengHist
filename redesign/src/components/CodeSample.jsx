import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { lineasResaltadas } from '../lib/resaltar'
import '../lib/resaltar.css'

// Bloque de ejemplo de las tarjetas de Conceptos. Cada ejemplo puede traer más
// de un lenguaje: antes iban pegados con un "/* css */" a mitad del código, que
// no se podía copiar ni entender por separado.

const NOMBRE = { js: 'JS', css: 'CSS', html: 'HTML' }

// El color del rótulo es el que la gente ya asocia a cada lenguaje. Texto suelto,
// nunca dentro de una caja.
const COLOR = {
  js: 'text-amber-600 dark:text-amber-300',
  css: 'text-sky-700 dark:text-sky-300',
  html: 'text-orange-600 dark:text-orange-300',
}

function Bloque({ t, lenguaje, codigo, primero }) {
  const [copiado, setCopiado] = useState(false)

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(codigo)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1600)
    } catch {
      setCopiado(false)
    }
  }

  const lineas = lineasResaltadas(codigo, lenguaje)

  return (
    <div className={primero ? '' : 'border-t border-zinc-200 dark:border-zinc-800'}>
      <div className="flex items-center justify-between gap-2 px-2.5 py-1 border-b border-zinc-200 dark:border-zinc-800">
        <span className={`font-mono text-[10px] font-bold tracking-wider ${COLOR[lenguaje] ?? ''}`}>
          {NOMBRE[lenguaje] ?? lenguaje}
        </span>
        <button
          onClick={copiar}
          className="inline-flex items-center gap-1 text-[10px] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer transition-colors"
        >
          {copiado ? <Check size={10} /> : <Copy size={10} />}
          {copiado ? t.compCopied : t.compCopy}
        </button>
      </div>
      <pre className="vs-pre px-2.5 py-2 font-mono text-[11px] leading-relaxed">
        {lineas.map((linea, i) => (
          <span key={i} className="vs-linea">
            {linea.map(([tipo, texto], j) =>
              tipo ? <span key={j} className={`vs-${tipo}`}>{texto}</span> : texto
            )}
          </span>
        ))}
      </pre>
    </div>
  )
}

export default function CodeSample({ t, etiqueta, bloques }) {
  if (!bloques?.length) return null
  return (
    <div className="mt-3">
      <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5">{etiqueta}</div>
      <div className="rounded-lg overflow-hidden bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
        {bloques.map(([lenguaje, codigo], i) => (
          <Bloque key={i} t={t} lenguaje={lenguaje} codigo={codigo} primero={i === 0} />
        ))}
      </div>
    </div>
  )
}
