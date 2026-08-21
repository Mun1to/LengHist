import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EJEMPLOS_PORTADA, PESTANAS as TABS } from '../lib/portada'

// Ventana de código de la portada: mismo bloque que ya usaba el hero.
export default function CodeWindow({ lang = 'es', className = '' }) {
  const [tab, setTab] = useState('Python')
  // Los cuatro lenguajes llegan ya resueltos desde `lib/portada.js`, que el
  // build rellena del catálogo. Buscarlos aquí obligaba a traerse los cien.
  const demo = EJEMPLOS_PORTADA[tab] ?? EJEMPLOS_PORTADA[TABS[0]]
  const code = demo[lang] ?? demo.es

  return (
    <div data-demo className={`relative overflow-hidden bg-zinc-950 border border-zinc-800 shadow-[0_20px_60px_rgba(0,0,0,.35)] ${className}`}>
      {/* Sin los tres puntos de macOS. Eran redondos en una pieza que ya no
          tiene ninguna esquina curva, y cuadrados no dicen nada: tres colores
          sueltos que no se pueden pulsar. Lo que identifica esta ventana son
          sus pestañas, que además funcionan. */}
      <div className="flex items-center px-3.5 py-3 border-b border-zinc-800">
        <div className="flex gap-0.5">
          {TABS.map((tb) => (
            <button
              key={tb}
              onClick={() => setTab(tb)}
              className={`font-mono text-[13px] inline-flex items-end min-h-6 px-1.5 pb-0.5 border-b cursor-pointer transition-colors ${
                tab === tb ? 'text-zinc-100 border-blue-400' : 'text-zinc-400 border-transparent hover:text-zinc-300'
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
          <span className="w-1 h-3.5" style={{ background: demo.color[0] }} />
          {demo.name} · {demo.year}
        </span>
        <span className="text-blue-300 font-bold">{demo.pop}/100</span>
      </div>
    </div>
  )
}
