import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Boxes, Braces, Languages, Lightbulb, Menu, Monitor, Moon, Sparkles, Sun, Terminal, Wrench, X,
} from 'lucide-react'
import Logo from './Logo'
import Buscador from './Buscador'
import { rutaDe } from '../lib/rutas'

// El buscador manda en el centro y la navegación se reparte a los lados, tres y
// tres. El corte va por la mitad del catálogo y no en cualquier sitio: leído de
// izquierda a derecha sale el mismo orden que en la portada y en el menú del
// móvil. Antes el reparto era otro y Consejos cambiaba de sitio según por dónde
// entrases.
//
// El centrado no depende de que los dos flancos midan lo mismo: los dos
// contenedores llevan `flex-1 basis-0`, así que se reparten el sobrante a partes
// iguales y la caja cae en el centro exacto de la ventana con cualquier orden
// (medido: desviación 0 px, y los dos grupos de enlaces a 16 px de la caja).
const ORDEN_MENU = ['languages', 'resources', 'concepts', 'components', 'skills', 'consejos']
const IZQUIERDA = ORDEN_MENU.slice(0, 3)
const DERECHA = ORDEN_MENU.slice(3)

function Enlaces({ t, claves, activeNav }) {
  return (
    <nav className="hidden xl:flex items-center gap-6">
      {claves.map((key) => (
        <Link
          key={key}
          to={rutaDe(key)}
          className={`text-sm py-1 border-b-2 whitespace-nowrap transition-colors ${
            activeNav === key
              ? 'border-indigo-500 text-tinta font-semibold'
              : 'border-transparent text-tinta-suave hover:text-tinta'
          }`}
        >
          {t.nav[key]}
        </Link>
      ))}
    </nav>
  )
}

const ICONO_TEMA = { sistema: Monitor, claro: Sun, oscuro: Moon }

// Un icono por sección, en el color del texto y no en el suyo: el color aquí
// competiría con el nombre, que es lo que se lee.
const ICONO_SECCION = {
  languages: Braces,
  resources: Wrench,
  concepts: Sparkles,
  components: Boxes,
  skills: Terminal,
  consejos: Lightbulb,
}

const CUENTA_SECCION = {
  languages: 'langs', resources: 'res', concepts: 'concepts',
  components: 'comps', skills: 'skills', consejos: 'consejos',
}

// Por debajo de 1280 no cabían los seis enlaces y simplemente desaparecían: en
// un móvil no había forma de llegar a ninguna sección salvo acertando con el
// buscador. El panel se lee como el índice de una revista: cada sección con su
// icono y cuántas fichas tiene dentro, que es el dato que de verdad ayuda a
// decidir por dónde entrar.
function MenuMovil({ t, lang, activeNav, abierto, onCerrar, onQuizClick, onAbrirResultado, totales, tema, onCambiarTema, onToggleLang }) {
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

  const IconoTema = ICONO_TEMA[tema] ?? Monitor

  return (
    <div className="xl:hidden fixed inset-x-0 top-[57px] bottom-0 z-40 bg-white dark:bg-zinc-950 border-t border-linea overflow-y-auto">
      <div className="px-5 py-5">
        {/* El buscador vive aquí mientras el panel está abierto: en la barra, con
            el logo y los tres botones al lado, se quedaba en «Buscar er». */}
        <Buscador t={t} lang={lang} onAbrir={(r) => { onCerrar(); onAbrirResultado(r) }} />

        <nav className="flex flex-col mt-5">
          {ORDEN_MENU.map((key) => {
            const Icono = ICONO_SECCION[key]
            const activa = activeNav === key
            return (
              <Link
                key={key}
                to={rutaDe(key)}
                onClick={onCerrar}
                className="pulsable flex items-center gap-3.5 py-3.5 px-2 -mx-2 rounded-lg border-b border-linea/70 active:bg-zinc-100 dark:active:bg-zinc-900 group"
              >
                <Icono
                  size={17}
                  className={`shrink-0 ${activa ? 'text-indigo-600 dark:text-indigo-400' : 'text-tinta-suave'}`}
                />
                <span
                  className={`text-2xl font-extrabold tracking-tight leading-none ${
                    activa ? 'text-indigo-600 dark:text-indigo-400' : 'text-tinta'
                  }`}
                >
                  {t.nav[key]}
                </span>
                <span className="ml-auto font-mono text-xs text-tinta-suave">
                  {totales[CUENTA_SECCION[key]]}
                </span>
              </Link>
            )
          })}
        </nav>

        <button
          onClick={() => { onCerrar(); onQuizClick() }}
          className="grupo-cta pulsable inline-flex items-center gap-2 mt-5 font-bold text-[15px] text-indigo-600 dark:text-indigo-400 cursor-pointer"
        >
          {t.testBtn}
          <ArrowRight size={15} className="flecha-desliza" />
        </button>

        {/* Tema e idioma bajan aquí: en la barra son dos iconos de 14px que en un
            móvil nadie encuentra, y aquí caben con su nombre escrito. */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-linea">
          <button
            onClick={onCambiarTema}
            className="pulsable flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-xl border border-linea text-sm font-semibold text-tinta-fuerte cursor-pointer"
          >
            <IconoTema key={tema} size={15} className="brinca" />
            {t.temasCorto[tema]}
          </button>
          <button
            onClick={onToggleLang}
            className="pulsable flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-xl border border-linea font-mono text-sm font-bold text-tinta-fuerte cursor-pointer"
          >
            <Languages size={15} />
            {lang === 'es' ? 'ES / EN' : 'EN / ES'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TopBar({
  t, lang, onToggleLang, activeNav, onLogoClick, onQuizClick, onAbrirResultado, tema, onCambiarTema, totales,
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

      <header className="sticky top-0 z-50 border-b border-linea bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
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

          {/* Con el panel abierto el buscador está dentro de él, a lo ancho:
              aquí, con el logo y los botones al lado, se quedaba en «Buscar er».
              El hueco se conserva para que la equis siga cayendo a la derecha. */}
          <div className="flex-1 xl:flex-none xl:w-[clamp(20rem,26vw,34rem)] min-w-0 flex justify-center">
            {!menu && <Buscador t={t} lang={lang} onAbrir={onAbrirResultado} />}
          </div>

          <div className="shrink-0 lg:flex-1 lg:basis-0 min-w-0 flex items-center justify-between gap-5">
            <Enlaces t={t} claves={DERECHA} activeNav={activeNav} />
            <div className="flex items-center gap-2 shrink-0 ml-auto">
              {/* Con el panel abierto, tema e idioma están dentro de él con su
                  nombre escrito: repetirlos aquí solo aprieta la barra. */}
              {!menu && (
                <>
                  <button
                    onClick={onCambiarTema}
                    aria-label={`${t.tema}: ${t.temas[tema]}`}
                    title={`${t.tema}: ${t.temas[tema]}`}
                    className="pulsable grid place-items-center w-9 h-9 rounded-lg text-tinta-suave hover:text-tinta hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                  >
                    <IconoTema key={tema} size={15} className="brinca" />
                  </button>
                  <button
                    onClick={onToggleLang}
                    aria-label={t.ariaLang}
                    title={lang === 'es' ? 'Switch to English' : 'Cambiar a español'}
                    className="pulsable flex items-center gap-1.5 h-9 px-1.5 text-xs font-mono font-bold text-tinta-suave hover:text-tinta cursor-pointer"
                  >
                    <Languages size={14} />
                    {lang.toUpperCase()}
                  </button>
                </>
              )}
              <button
                onClick={onQuizClick}
                className="pulsable hidden 2xl:inline-flex items-center rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 whitespace-nowrap cursor-pointer"
              >
                {t.ctaQuiz}
              </button>
              <button
                onClick={() => setMenu((v) => !v)}
                aria-label={menu ? t.menuCerrar : t.menuAbrir}
                aria-expanded={menu}
                className="pulsable xl:hidden grid place-items-center w-9 h-9 rounded-lg text-tinta-fuerte hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
              >
                {menu ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <MenuMovil
        t={t} lang={lang} activeNav={activeNav} abierto={menu} totales={totales}
        tema={tema} onCambiarTema={onCambiarTema} onToggleLang={onToggleLang}
        onAbrirResultado={onAbrirResultado}
        onCerrar={() => setMenu(false)}
        onQuizClick={onQuizClick}
      />
    </>
  )
}
