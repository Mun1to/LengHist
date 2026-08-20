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
  js: 'text-ambar',
  css: 'text-cielo',
  html: 'text-naranja',
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
    <div className={primero ? '' : 'border-t border-linea'}>
      <div className="flex items-center justify-between gap-2 px-2.5 py-1 border-b border-linea">
        <span className={`font-mono text-[12px] font-bold tracking-wider ${COLOR[lenguaje] ?? ''}`}>
          {NOMBRE[lenguaje] ?? lenguaje}
        </span>
        <button
          onClick={copiar}
          className="inline-flex items-center gap-1 min-h-6 px-1.5 -mx-1.5 text-xs text-tinta-suave hover:text-tinta cursor-pointer transition-colors"
        >
          {copiado ? <Check size={11} /> : <Copy size={11} />}
          {copiado ? t.compCopied : t.compCopy}
        </button>
      </div>
      <pre className="vs-pre px-2.5 py-2 font-mono text-[12px] leading-relaxed">
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
      <div className="font-mono text-[12px] uppercase tracking-wider text-tinta-suave mb-1.5">{etiqueta}</div>
      <div className="overflow-hidden bg-zinc-50 dark:bg-zinc-950 border border-linea">
        {bloques.map(([lenguaje, codigo], i) => (
          <Bloque key={i} t={t} lenguaje={lenguaje} codigo={codigo} primero={i === 0} />
        ))}
      </div>
    </div>
  )
}
