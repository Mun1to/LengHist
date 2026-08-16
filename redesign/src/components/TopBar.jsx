import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Languages, Menu, Monitor, Moon, Sun, X } from 'lucide-react'
import Logo from './Logo'
import Buscador from './Buscador'
import { rutaDe } from '../lib/rutas'

// El buscador manda en el centro y la navegación se reparte a los lados, tres y
// tres, buscando que los dos grupos midan parecido: es lo que hace que la caja
// del medio se vea centrada de verdad y no solo esté centrada por CSS.
const IZQUIERDA = ['languages', 'resources', 'consejos']
const DERECHA = ['concepts', 'components', 'skills']
const TODAS = [...IZQUIERDA, ...DERECHA]

function Enlaces({ t, claves, activeNav }) {
  return (
    <nav className="hidden xl:flex items-center gap-6">
      {claves.map((key) => (
        <Link
          key={key}
          to={rutaDe(key)}
          className={`text-sm py-1 border-b-2 whitespace-nowrap transition-colors ${
            activeNav === key
              ? 'border-indigo-500 text-zinc-900 dark:text-zinc-50 font-semibold'
              : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          {t.nav[key]}
        </Link>
      ))}
    </nav>
  )
}

// Por debajo de 1280 no cabían los seis enlaces y simplemente desaparecían: en
// un móvil no había forma de llegar a ninguna sección salvo acertando con el
// buscador. Este es el menú que faltaba.
function MenuMovil({ t, activeNav, abierto, onCerrar, onQuizClick }) {
  // Con el panel abierto no se scrollea la página de detrás.
  useEffect(() => {
    if (!abierto) return
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previo }
  }, [abierto])

  // Escape cierra, como cualquier panel.
  useEffect(() => {
    if (!abierto) return
    const tecla = (e) => { if (e.key === 'Escape') onCerrar() }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [abierto, onCerrar])

  if (!abierto) return null

  return (
    <div className="xl:hidden fixed inset-x-0 top-[57px] bottom-0 z-40 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 overflow-y-auto">
      <nav className="px-6 py-4 flex flex-col">
        {TODAS.map((key) => (
          <Link
            key={key}
            to={rutaDe(key)}
            onClick={onCerrar}
            className={`flex items-center justify-between py-3.5 border-b border-zinc-100 dark:border-zinc-900 text-base transition-colors ${
              activeNav === key
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-zinc-700 dark:text-zinc-300'
            }`}
          >
            {t.nav[key]}
          </Link>
        ))}
      </nav>
      <div className="px-6 pb-8">
        <button
          onClick={() => { onCerrar(); onQuizClick() }}
          className="w-full rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-3 cursor-pointer transition-colors"
        >
          {t.ctaQuiz}
        </button>
      </div>
    </div>
  )
}

const ICONO_TEMA = { sistema: Monitor, claro: Sun, oscuro: Moon }

export default function TopBar({
  t, lang, onToggleLang, activeNav, onLogoClick, onQuizClick, onAbrirResultado, tema, onCambiarTema,
}) {
  const [menu, setMenu] = useState(false)
  const IconoTema = ICONO_TEMA[tema] ?? Monitor

  return (
    <>
      <a
        href="#principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-lg focus:bg-zinc-900 focus:text-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
      >
        {t.saltarAlContenido}
      </a>

      <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        {/* Los dos flancos van con flex-1 basis-0: reparten a partes iguales lo que
            sobra, así que el buscador cae en el centro exacto de la ventana. Con un
            simple ml-auto quedaba 70px a la izquierda, porque el logo pesa mucho
            menos que el idioma y el botón del test juntos. */}
        <div className="flex items-center gap-4 px-6 py-3">
          <div className="shrink-0 lg:flex-1 lg:basis-0 min-w-0 flex items-center justify-between gap-5">
            <Link
              to="/"
              onClick={() => { setMenu(false); onLogoClick() }}
              aria-label="Vibeset"
              title="Vibeset"
              className="group relative grid place-items-center shrink-0 w-14 h-8"
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
            </Link>
            <Enlaces t={t} claves={IZQUIERDA} activeNav={activeNav} />
          </div>

          <div className="flex-1 xl:flex-none xl:w-[clamp(20rem,26vw,34rem)] min-w-0 flex justify-center">
            <Buscador t={t} lang={lang} onAbrir={onAbrirResultado} />
          </div>

          <div className="shrink-0 lg:flex-1 lg:basis-0 min-w-0 flex items-center justify-between gap-5">
            <Enlaces t={t} claves={DERECHA} activeNav={activeNav} />
            <div className="flex items-center gap-2 shrink-0 ml-auto">
              <button
                onClick={onCambiarTema}
                aria-label={`${t.tema}: ${t.temas[tema]}`}
                title={`${t.tema}: ${t.temas[tema]}`}
                className="grid place-items-center w-9 h-9 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
              >
                <IconoTema size={15} />
              </button>
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
                className="hidden xl:inline-flex items-center rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 whitespace-nowrap cursor-pointer transition-colors"
              >
                {t.ctaQuiz}
              </button>
              <button
                onClick={() => setMenu((v) => !v)}
                aria-label={menu ? t.menuCerrar : t.menuAbrir}
                aria-expanded={menu}
                className="xl:hidden grid place-items-center w-9 h-9 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
              >
                {menu ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <MenuMovil
        t={t} activeNav={activeNav} abierto={menu}
        onCerrar={() => setMenu(false)}
        onQuizClick={onQuizClick}
      />
    </>
  )
}
