import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LANGUAGES } from '../data/languages'
import { codeFor } from '../data/codeEn'

const TABS = ['Python', 'JavaScript', 'Rust', 'Go']

// Ventana de código de la portada: mismo bloque que ya usaba el hero.
export default function CodeWindow({ lang = 'es', className = '' }) {
  const [tab, setTab] = useState('Python')
  const demo = LANGUAGES.find((l) => l.name === tab) ?? LANGUAGES[0]
  const code = codeFor(demo, lang)

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-[0_20px_60px_rgba(0,0,0,.35)] ${className}`}>
      <div className="flex items-center gap-1.5 px-3.5 py-3 border-b border-zinc-800">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <div className="flex gap-0.5 ml-2.5">
          {TABS.map((tb) => (
            <button
              key={tb}
              onClick={() => setTab(tb)}
              className={`font-mono text-[13px] px-1 pb-0.5 border-b cursor-pointer transition-colors ${
                tab === tb ? 'text-zinc-100 border-indigo-400' : 'text-zinc-400 border-transparent hover:text-zinc-300'
              }`}
            >
              {tb}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 min-h-[150px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={demo.name}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            <pre className="font-mono text-[13px] leading-relaxed text-zinc-200 whitespace-pre-wrap">{code.example}</pre>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800 font-mono text-xs text-zinc-400">
        <span className="inline-flex items-center gap-2">
          <span className="w-1 h-3.5 rounded-full" style={{ background: demo.color[0] }} />
          {demo.name} · {demo.year}
        </span>
        <span className="text-indigo-300 font-bold">{demo.pop}/100</span>
      </div>
    </div>
  )
}
