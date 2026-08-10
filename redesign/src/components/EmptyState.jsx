import { SearchX } from 'lucide-react'

export default function EmptyState({ t, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 text-zinc-400">
      <SearchX size={34} className="mb-3" />
      <p className="text-sm mb-4">{t.empty}</p>
      <button
        onClick={onClear}
        className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 border-b border-indigo-500/40 hover:border-indigo-500 pb-0.5 cursor-pointer transition-colors"
      >
        {t.emptyReset}
      </button>
    </div>
  )
}
