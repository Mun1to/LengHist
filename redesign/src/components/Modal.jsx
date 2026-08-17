import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, closeLabel = 'Close', wide = false }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center p-5 sm:p-10 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            className={`w-full ${wide ? 'max-w-4xl' : 'max-w-2xl'} rounded-2xl bg-panel border border-linea shadow-2xl`}
          >
            <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-linea">
              <h2 className="text-lg font-extrabold tracking-tight">{title}</h2>
              <button
                onClick={onClose}
                aria-label={closeLabel}
                className="shrink-0 w-8 h-8 grid place-items-center text-tinta-suave hover:text-tinta cursor-pointer transition-colors"
              >
                <X size={17} />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
