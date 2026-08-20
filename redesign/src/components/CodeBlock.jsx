import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export default function CodeBlock({ t, title, code }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="rounded-xl border border-linea overflow-hidden bg-panel">
      <div className="flex items-center justify-between gap-3 px-3.5 py-2 border-b border-linea">
        <span className="font-mono text-xs text-tinta-suave">{title}</span>
        <button
          onClick={copy}
          className="pulsable inline-flex items-center gap-1.5 min-h-6 rounded-md px-1.5 py-1 -mr-1.5 text-xs text-tinta-suave hover:text-tinta cursor-pointer"
        >
          {copied ? <Check size={12} className="text-esmeralda brinca" /> : <Copy size={12} />}
          {copied ? t.compCopied : t.compCopy}
        </button>
      </div>
      <pre className="px-3.5 py-3 overflow-x-auto font-mono text-xs leading-relaxed text-tinta-fuerte">
        {code}
      </pre>
    </div>
  )
}
