import { Languages } from 'lucide-react'
import Logo from './Logo'
import Buscador from './Buscador'

// El buscador manda en el centro y la navegación se reparte a los lados, tres y
// tres, buscando que los dos grupos midan parecido: es lo que hace que la caja
// del medio se vea centrada de verdad y no solo esté centrada por CSS.
const IZQUIERDA = ['languages', 'resources', 'consejos']
const DERECHA = ['concepts', 'components', 'skills']

function Enlaces({ t, claves, activeNav, setActiveNav }) {
  return (
    <nav className="hidden xl:flex items-center gap-6">
      {claves.map((key) => (
        <button
          key={key}
          onClick={() => setActiveNav(key)}
          className={`text-sm py-1 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeNav === key
              ? 'border-indigo-500 text-zinc-900 dark:text-zinc-50 font-semibold'
              : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          {t.nav[key]}
        </button>
      ))}
    </nav>
  )
}

export default function TopBar({
  t, lang, onToggleLang, activeNav, setActiveNav, onLogoClick, onQuizClick, onAbrirResultado,
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      {/* Los dos flancos van con flex-1 basis-0: reparten a partes iguales lo que
          sobra, así que el buscador cae en el centro exacto de la ventana. Con un
          simple ml-auto quedaba 70px a la izquierda, porque el logo pesa mucho
          menos que el idioma y el botón del test juntos. */}
      <div className="flex items-center gap-4 px-6 py-3">
        <div className="shrink-0 lg:flex-1 lg:basis-0 min-w-0 flex items-center justify-between gap-5">
          <button
            onClick={onLogoClick}
            aria-label="Vibeset"
            title="Vibeset"
            className="group relative grid place-items-center shrink-0 w-14 h-8 cursor-pointer"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute w-14 h-7 rounded-full bg-zinc-900/8 dark:bg-white/20 blur-xl opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            />
            <span
              className="relative text-zinc-900 dark:text-white transition-transform duration-300 group-hover:scale-110 [filter:drop-shadow(0_0_6px_rgba(24,24,27,0.20))] dark:[filter:drop-shadow(0_0_5px_rgba(255,255,255,0.55))_drop-shadow(0_0_16px_rgba(255,255,255,0.30))]"
            >
              <Logo size={28} wide />
            </span>
          </button>
          <Enlaces t={t} claves={IZQUIERDA} activeNav={activeNav} setActiveNav={setActiveNav} />
        </div>

        <div className="flex-1 xl:flex-none xl:w-[clamp(20rem,26vw,34rem)] min-w-0 flex justify-center">
          <Buscador t={t} lang={lang} onAbrir={onAbrirResultado} />
        </div>

        <div className="shrink-0 lg:flex-1 lg:basis-0 min-w-0 flex items-center justify-between gap-5">
          <Enlaces t={t} claves={DERECHA} activeNav={activeNav} setActiveNav={setActiveNav} />
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <button
              onClick={onToggleLang}
              aria-label={t.ariaLang}
              title={lang === 'es' ? 'Switch to English' : 'Cambiar a español'}
              className="flex items-center gap-1.5 h-9 px-1.5 text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer transition-colors"
            >
              <Languages size={14} />
              {lang.toUpperCase()}
            </button>
            <button
              onClick={onQuizClick}
              className="hidden 2xl:inline-flex items-center rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 whitespace-nowrap cursor-pointer transition-colors"
            >
              {t.ctaQuiz}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
