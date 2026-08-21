import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Boxes, Braces, Lightbulb, Menu, Sparkles, Terminal, Wrench, X,
} from 'lucide-react'
import Logo from './Logo'
import Buscador from './Buscador'
import BotonGitHub from './BotonGitHub'
import VistazoMenu from './VistazoMenu'
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

// La escala de la barra, en un sitio y no repartida por doce clases sueltas.
//
// Antes había cuatro alturas conviviendo (el logo a 32, los botones a 36, el
// CTA a 38 por su relleno), tres radios (``, `` y el del
// buscador) y cuatro espaciados sin relación entre ellos (1.5, 2, 4 y 5). Nada
// de eso se ve como un fallo por separado, y juntos son exactamente por qué una
// barra se siente descuidada aunque no sepas señalar dónde.
//
// El sistema: **una sola altura de control (36px)** para todo lo pulsable, así
// todo comparte eje; **esquina recta**, que es lo que habla la retícula que
// estrenó la portada; y el espaciado en dos escalones nada más, 8px dentro de un
// grupo y 24px entre grupos.
const ALTO = 'h-9'
const CONTROL = `${ALTO} grid place-items-center w-9 text-tinta-suave hover:text-tinta hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer`

function Enlaces({ t, lang, claves, activeNav, onAsomar, onCerrar }) {
  return (
    <nav className="hidden xl:flex items-center">
      {claves.map((key) => (
        <Link
          key={key}
          to={rutaDe(key, null, lang)}
          // El área pulsable la hace el relleno, no el tamaño de la letra: antes
          // solo se podía pulsar sobre las letras, y en «C» o en «Skills» eso es
          // un blanco muy pequeño. Ahora cada enlace ocupa su celda entera.
          //
          // El activo se marca en TINTA y no en indigo. En esta barra el indigo
          // era el único color de marca suelto, y competía con los catorce
          // colores de categoría que ya usa el catálogo para decir otra cosa.
          onMouseEnter={(e) => onAsomar(key, e.currentTarget)}
          // También con el foco del teclado: si el asomo solo respondiera al
          // ratón, quien navega con el tabulador no sabría nunca que existe.
          onFocus={(e) => onAsomar(key, e.currentTarget)}
          // Y se cierra al pulsar. Sin esto el panel se queda abierto encima de
          // la página recién cargada hasta que el ratón sale del header: se
          // pulsa, la página cambia debajo y lo que se sigue viendo es el mismo
          // panel, así que parece que el enlace no ha hecho nada.
          onClick={onCerrar}
          className={`${ALTO} relative inline-flex items-center px-3 text-sm whitespace-nowrap transition-colors ${
            activeNav === key
              ? 'text-tinta font-semibold'
              : 'text-tinta-suave hover:text-tinta hover:bg-zinc-100 dark:hover:bg-zinc-900'
          }`}
        >
          {t.nav[key]}
          {activeNav === key && (
            <span aria-hidden="true" className="absolute inset-x-2 bottom-0 h-0.5 bg-tinta" />
          )}
        </Link>
      ))}
    </nav>
  )
}

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
function MenuMovil({ t, lang, activeNav, abierto, onCerrar, onQuizClick, onAbrirResultado, totales }) {
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
                to={rutaDe(key, null, lang)}
                onClick={onCerrar}
                className="pulsable flex items-center gap-3.5 py-3.5 px-2 -mx-2 border-b border-linea/70 active:bg-zinc-100 dark:active:bg-zinc-900 group"
              >
                <Icono
                  size={17}
                  className={`shrink-0 ${activa ? 'text-blue-600 dark:text-blue-400' : 'text-tinta-suave'}`}
                />
                <span
                  className={`text-2xl font-extrabold tracking-tight leading-none ${
                    activa ? 'text-blue-600 dark:text-blue-400' : 'text-tinta'
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
          className="grupo-cta pulsable inline-flex items-center gap-2 mt-5 font-bold text-[15px] text-blue-600 dark:text-blue-400 cursor-pointer"
        >
          {t.testBtn}
          <ArrowRight size={15} className="flecha-desliza" />
        </button>

        {/* En la barra este botón está oculto por debajo de xl, así que sin esta
            fila el repositorio no se alcanzaba desde el móvil salvo bajando
            hasta el pie. Aquí la invitación va escrita, porque el `hover` que la
            enseña en escritorio no existe en un dedo.

            El tema y el idioma estaban aquí y se fueron: el tema ya no tiene
            interruptor en ningún sitio (sigue al sistema, en vivo) y el idioma
            bajó al pie. */}
        <div className="mt-6 pt-5 border-t border-linea">
          <BotonGitHub t={t} conTexto />
        </div>
      </div>
    </div>
  )
}

export default function TopBar({
  t, lang, activeNav, onLogoClick, onQuizClick, onAbrirResultado, totales,
}) {
  const [menu, setMenu] = useState(false)

  // Qué sección se está asomando, con retardo a los dos lados.
  //
  // Los dos retardos hacen falta y no son iguales. **Al abrir (120ms)**, porque
  // el ratón cruza la barra de camino a otro sitio y sin espera el panel se
  // enciende y se apaga tres veces en un gesto que no iba con él. **Al cerrar
  // (180ms)**, porque el puntero pasa por el hueco entre el enlace y el panel, y
  // sin margen el panel se cierra justo cuando ibas a entrar en él, que es el
  // fallo clásico de los menús de este tipo.
  const [asomada, setAsomada] = useState(null)
  const reloj = useRef(null)

  const programar = (valor, ms) => {
    clearTimeout(reloj.current)
    reloj.current = setTimeout(() => setAsomada(valor), ms)
  }
  // Viaja el CENTRO del enlace, no su borde izquierdo: el panel se centra debajo
  // de la sección que lo abre. Con el borde izquierdo, el panel crecía siempre
  // hacia la derecha, y en las secciones de la derecha eso lo mandaba al filo de
  // la pantalla en vez de dejarlo debajo de lo que estabas señalando.
  const asomar = (clave, el) => {
    const r = el?.getBoundingClientRect()
    programar({ clave, x: r ? Math.round(r.left + r.width / 2) : 0 }, 120)
  }
  const cerrarAsomo = () => programar(null, 180)
  // Cerrar de golpe, sin espera: al pulsar un enlace o al dar a Escape no hay
  // ningún gesto en curso que proteger.
  const cerrarYa = () => { clearTimeout(reloj.current); setAsomada(null) }

  useEffect(() => () => clearTimeout(reloj.current), [])

  useEffect(() => {
    if (!asomada) return
    const tecla = (e) => { if (e.key === 'Escape') cerrarYa() }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [asomada])

  // El panel del móvil se cierra solo al llegar a un ancho de escritorio.
  // Sin esto queda abierto en un estado imposible: el panel se oculta por CSS
  // (`xl:hidden`) pero React sigue creyendo que está abierto, y como el buscador
  // de la barra se pinta con `{!menu && ...}`, desaparece y no vuelve. Se ve
  // girando el teléfono a horizontal con el menú abierto, o arrastrando el borde
  // de la ventana. Encontrado probando el botón de GitHub, no reportado.
  useEffect(() => {
    const escritorio = window.matchMedia('(min-width: 1280px)')
    const cerrar = (e) => { if (e.matches) setMenu(false) }
    escritorio.addEventListener('change', cerrar)
    return () => escritorio.removeEventListener('change', cerrar)
  }, [])

  return (
    <>
      <a
        href="#principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-zinc-900 focus:text-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
      >
        {t.saltarAlContenido}
      </a>

      <header
        className="sticky top-0 z-50 border-b border-linea bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md"
        // Se cierra al salir del header entero y no de cada enlace: así el
        // puntero puede bajar del enlace al panel sin cruzar tierra de nadie.
        onMouseLeave={cerrarAsomo}
      >
        {/* Los dos flancos van con flex-1 basis-0: reparten a partes iguales lo que
            sobra, así que el buscador cae en el centro exacto de la ventana. Con un
            simple ml-auto quedaba 70px a la izquierda, porque el logo pesa mucho
            menos que el idioma y el botón del test juntos. */}
        <div className="flex items-center gap-6 px-6 h-14">
          <div className="shrink-0 lg:flex-1 lg:basis-0 min-w-0 flex items-center justify-between gap-6">
            <Link
              to={rutaDe('home', null, lang)}
              onClick={() => { setMenu(false); onLogoClick() }}
              aria-label="Vibeset"
              title="Vibeset"
              className={`group relative grid place-items-center shrink-0 w-14 ${ALTO}`}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute w-14 h-8 rounded-full bg-zinc-900/8 dark:bg-white/20 blur-xl opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              />
              <span
                className="relative text-zinc-900 dark:text-white transition-transform duration-300 group-hover:scale-110 [filter:drop-shadow(0_0_6px_rgba(24,24,27,0.20))] dark:[filter:drop-shadow(0_0_5px_rgba(255,255,255,0.55))_drop-shadow(0_0_16px_rgba(255,255,255,0.30))]"
              >
                <Logo size={28} wide />
              </span>
            </Link>
            <Enlaces t={t} lang={lang} claves={IZQUIERDA} activeNav={activeNav} onAsomar={asomar} onCerrar={cerrarYa} />
          </div>

          {/* Con el panel abierto el buscador está dentro de él, a lo ancho:
              aquí, con el logo y los botones al lado, se quedaba en «Buscar er».
              El hueco se conserva para que la equis siga cayendo a la derecha. */}
          {/* El ancho bajó de 34rem a 30rem al entrar el botón de GitHub: con el
              anterior, a 1600px la barra desbordaba y el botón del test se salía
              por la derecha. Medido, no supuesto. */}
          <div className="flex-1 xl:flex-none xl:w-[clamp(18rem,22vw,30rem)] min-w-0 flex justify-center">
            {!menu && <Buscador t={t} lang={lang} onAbrir={onAbrirResultado} />}
          </div>

          <div className="shrink-0 lg:flex-1 lg:basis-0 min-w-0 flex items-center justify-between gap-6">
            <Enlaces t={t} lang={lang} claves={DERECHA} activeNav={activeNav} onAsomar={asomar} onCerrar={cerrarYa} />
            <div className="flex items-center gap-2 shrink-0 ml-auto">
              <BotonGitHub t={t} />
              {/* El test entra a 1620px y no en `2xl` (1536), que es donde estaba:
                  justo en ese ancho el botón dejaba 6px hasta el borde en vez de
                  los 24 del relleno de la barra, o sea que aparecía pisando el
                  margen. Medido. */}
              <button
                onClick={onQuizClick}
                className={`pulsable hidden min-[1620px]:inline-flex items-center ${ALTO} px-4 bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-semibold whitespace-nowrap cursor-pointer`}
              >
                {t.ctaQuiz}
              </button>
              <button
                onClick={() => setMenu((v) => !v)}
                aria-label={menu ? t.menuCerrar : t.menuAbrir}
                aria-expanded={menu}
                className={`pulsable xl:hidden grid ${CONTROL}`}
              >
                {menu ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Solo en escritorio: en táctil no hay ratón que pueda pasar por
            encima, y el panel del móvil ya enseña las seis secciones con sus
            cifras, que es la misma información. */}
        {asomada && !menu && (
          <div className="hidden xl:block">
            <VistazoMenu
              seccion={asomada.clave} anclaX={asomada.x}
              lang={lang} t={t} onCerrar={cerrarYa}
            />
          </div>
        )}
      </header>

      <MenuMovil
        t={t} lang={lang} activeNav={activeNav} abierto={menu} totales={totales}
        onAbrirResultado={onAbrirResultado}
        onCerrar={() => setMenu(false)}
        onQuizClick={onQuizClick}
      />
    </>
  )
}
