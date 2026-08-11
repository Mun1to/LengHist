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
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-3 px-3.5 py-2 border-b border-zinc-200 dark:border-zinc-800">
        <span className="font-mono text-xs text-zinc-400">{title}</span>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer transition-colors"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? t.compCopied : t.compCopy}
        </button>
      </div>
      <pre className="px-3.5 py-3 overflow-x-auto font-mono text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        {code}
      </pre>
    </div>
  )
}
