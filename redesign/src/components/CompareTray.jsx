import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowLeftRight } from 'lucide-react'
import { LANGUAGES } from '../data/languages'

export default function CompareTray({ t, names, onRemove, onClear, onOpen }) {
  return (
    <AnimatePresence>
      {names.length > 0 && (
        <motion.div
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          exit={{ y: 90 }}
          transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
          className="fixed left-0 right-0 bottom-0 z-40 border-t border-linea bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md"
        >
          <div className="flex items-center gap-4 flex-wrap px-6 py-3">
            <div className="flex items-center gap-4 flex-wrap flex-1 min-w-0">
              {names.map((n) => {
                const l = LANGUAGES.find((x) => x.name === n)
                return (
                  <span key={n} className="inline-flex items-center gap-2 text-sm font-semibold">
                    <span className="w-1 h-3.5 rounded-full shrink-0" style={{ background: l?.color[0] }} />
                    {n}
                    <button
                      onClick={() => onRemove(n)}
                      aria-label={t.quitar}
                      className="text-tinta-suave hover:text-rojo cursor-pointer transition-colors"
                    >
                      <X size={13} />
                    </button>
                  </span>
                )
              })}
            </div>
            <div className="flex items-center gap-5 shrink-0">
              <button
                onClick={onClear}
                className="text-sm font-semibold text-tinta-suave hover:text-tinta cursor-pointer transition-colors"
              >
                {t.vaciar}
              </button>
              <button
                onClick={onOpen}
                disabled={names.length < 2}
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 cursor-pointer transition-colors"
              >
                <ArrowLeftRight size={14} /> {t.comparar} ({names.length})
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
