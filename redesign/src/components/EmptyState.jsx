import { SearchX } from 'lucide-react'

export default function EmptyState({ t, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 text-tinta-suave">
      <SearchX size={34} className="mb-3" />
      <p className="text-sm mb-4">{t.empty}</p>
      <button
        onClick={onClear}
        className="text-sm font-semibold text-blue-600 dark:text-blue-400 border-b border-blue-500/40 hover:border-blue-500 pb-0.5 cursor-pointer transition-colors"
      >
        {t.emptyReset}
      </button>
    </div>
  )
}
