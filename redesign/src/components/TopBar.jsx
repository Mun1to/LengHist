import { Search, Sparkles, Languages } from 'lucide-react'

export default function TopBar({ t, lang, setLang, activeNav, setActiveNav, onSearchClick, onQuizClick }) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="flex items-center gap-8 px-6 py-3">
        <button onClick={() => setActiveNav('languages')} className="flex items-center gap-2 font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 shrink-0 cursor-pointer">
          <span className="font-mono text-[13px] font-bold text-indigo-600 dark:text-indigo-400">&lt;/&gt;</span>
          Vibeset
        </button>

        <nav className="hidden md:flex items-center gap-6">
          {Object.entries(t.nav).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveNav(key)}
              className={`text-sm py-1 border-b-2 transition-colors cursor-pointer ${
                activeNav === key
                  ? 'border-indigo-500 text-zinc-900 dark:text-zinc-50 font-semibold'
                  : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={onSearchClick}
            aria-label="Buscar"
            title="Ir al buscador"
            className="w-9 h-9 grid place-items-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer transition-colors"
          >
            <Search size={16} />
          </button>
          <button
            onClick={() => setLang((l) => (l === 'es' ? 'en' : 'es'))}
            aria-label="Idioma"
            title={lang === 'es' ? 'Switch to English' : 'Cambiar a español'}
            className="flex items-center gap-1.5 h-9 px-1.5 text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer transition-colors"
          >
            <Languages size={14} />
            {lang.toUpperCase()}
          </button>
          <button
            onClick={onQuizClick}
            className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 cursor-pointer transition-colors"
          >
            <Sparkles size={14} />
            {t.ctaQuiz}
          </button>
        </div>
      </div>
    </header>
  )
}
