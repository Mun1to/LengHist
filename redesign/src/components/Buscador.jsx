import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Search, ArrowUpRight, CornerDownLeft } from 'lucide-react'
import { construirIndice, buscar } from '../data/buscador'

// Buscador: mira en los cinco catálogos a la vez, no solo en la sección abierta.
// Se maneja entero con el teclado y se abre con ⌘K / Ctrl+K.
//
// Desde el 2026-08-20 se abre como una paleta en el centro de la pantalla, con
// el resto de la página difuminada por detrás. Antes era un campo en la barra
// con una lista colgando, y eso tenía dos problemas de verdad, no de gusto:
// la lista competía en anchura con un campo pensado para caber en la barra, y
// buscar no se sentía como una acción sino como escribir en un hueco. Con la
// paleta, la página de detrás se aparta y solo queda lo que estás haciendo.
//
// Lo que hay en la barra pasa a ser un DISPARADOR, no un campo: mide lo mismo y
// se ve igual, pero es un botón. Un input que al enfocarse abre otro input
// distinto es una trampa para los lectores de pantalla y para el teclado.

const esMac = () =>
  typeof navigator !== 'undefined' &&
  /Mac|iPhone|iPad|iPod/.test(navigator.userAgentData?.platform || navigator.platform || '')

export default function Buscador({ t, lang, onAbrir, className = '' }) {
  const [consulta, setConsulta] = useState('')
  const [abierto, setAbierto] = useState(false)
  const [activo, setActivo] = useState(0)
  const [mac, setMac] = useState(false)
  const panelRef = useRef(null)
  const campoRef = useRef(null)
  const listaRef = useRef(null)
  const disparadorRef = useRef(null)

  useEffect(() => { setMac(esMac()) }, [])

  // El índice se arma una vez por idioma, no en cada tecla.
  const indice = useMemo(() => construirIndice(lang), [lang])
  const grupos = useMemo(() => buscar(indice, consulta), [indice, consulta])
  const planos = useMemo(() => grupos.flatMap((g) => g.items), [grupos])

  useEffect(() => { setActivo(0) }, [consulta])

  // ⌘K / Ctrl+K desde cualquier sitio de la página.
  useEffect(() => {
    const atajo = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setAbierto(true)
      }
    }
    window.addEventListener('keydown', atajo)
    return () => window.removeEventListener('keydown', atajo)
  }, [])

  // Con la paleta abierta: el foco entra en el campo y la página de detrás no se
  // mueve. Sin bloquear el scroll, la rueda del ratón desplaza el catálogo por
  // debajo del velo, que es de las cosas que más delatan un modal mal hecho.
  useEffect(() => {
    if (!abierto) return
    const previo = document.body.style.overflow
    // El disparador se guarda AL ABRIR y no se lee al cerrar: para entonces el
    // ref puede apuntar a otro nodo (el mismo componente se pinta en la barra y
    // en el panel del móvil), y el foco acabaría en el botón equivocado.
    const volverA = disparadorRef.current
    document.body.style.overflow = 'hidden'
    const foco = requestAnimationFrame(() => campoRef.current?.focus())

    // Escape se escucha en la VENTANA, no en el panel, y esto no es una
    // redundancia: mientras estuvo solo en el `onKeyDown` del diálogo, bastaba
    // con que el foco saliera del campo para que la única salida dejara de
    // funcionar con el scroll de la página ya bloqueado. Eso es una paleta que
    // atrapa al visitante, y pasó de verdad. La salida de emergencia no puede
    // depender de dónde esté el foco.
    const salir = (e) => { if (e.key === 'Escape') { e.preventDefault(); cerrar() } }
    window.addEventListener('keydown', salir)

    return () => {
      window.removeEventListener('keydown', salir)
      document.body.style.overflow = previo
      cancelAnimationFrame(foco)
      // El foco vuelve de donde salió, que es lo que espera quien navega con el
      // tabulador: si se pierde, el siguiente tabulador empieza desde el
      // principio del documento.
      volverA?.focus()
    }
  }, [abierto])

  // Mantiene a la vista la fila señalada al moverse con las flechas.
  useEffect(() => {
    listaRef.current?.querySelector('[data-activo="true"]')
      ?.scrollIntoView({ block: 'nearest' })
  }, [activo, grupos])

  const cerrar = () => { setAbierto(false); setConsulta('') }

  const elegir = (entrada) => {
    if (!entrada) return
    cerrar()
    onAbrir(entrada)
  }

  // Escape no está aquí a propósito: vive en la ventana, arriba, para que
  // funcione aunque el foco se haya escapado del panel.
  const teclas = (e) => {
    if (!planos.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActivo((i) => (i + 1) % planos.length) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActivo((i) => (i - 1 + planos.length) % planos.length) }
    else if (e.key === 'Enter') { e.preventDefault(); elegir(planos[activo]) }
  }

  const hayConsulta = consulta.trim().length >= 2
  let indiceGlobal = -1

  return (
    <>
      {/* El disparador. Mide y pesa lo mismo que el campo de antes para no mover
          la simetría de la barra, pero es un botón. */}
      <button
        ref={disparadorRef}
        type="button"
        onClick={() => setAbierto(true)}
        aria-label={t.ariaSearch}
        aria-haspopup="dialog"
        // El fondo va al color del panel y no a un gris. `tinta-suave` es el
        // gris más bajo que pasa AA, pero eso solo vale sobre el fondo base:
        // sobre `zinc-100` cae a 4,46:1 y deja de cumplir. Lo destapó el kitchen
        // sink midiendo el fondo REAL del control en vez del de la página, que
        // es lo que se le escapaba a las auditorías anteriores. Con el borde
        // basta para que se lea como campo, y además es el lenguaje de la casa.
        className={`group/b flex items-center gap-2.5 w-full h-9 px-3 bg-panel border border-linea hover:border-linea-viva text-left cursor-pointer transition-colors ${className}`}
      >
        <Search size={15} className="shrink-0 text-tinta-suave" />
        <span className="flex-1 min-w-0 truncate text-sm text-tinta-suave">{t.buscarTodoPh}</span>
        <span className="hidden sm:block font-mono text-[11px] text-tinta-suave select-none">
          {mac ? '⌘K' : 'Ctrl K'}
        </span>
      </button>

      {/* El velo se cuelga del `body` con un portal, y esto no es preferencia de
          estilo: es la única forma de que funcione. El componente vive dentro
          del `<header>`, y ese header lleva `backdrop-blur` para su barra
          translúcida; un ancestro con `backdrop-filter` crea un bloque
          contenedor para todo lo `fixed` que lleve dentro, así que el velo
          «a pantalla completa» medía 1440x126 en una ventana de 900. De ahí
          salían los tres fallos a la vez: el desenfoque solo tapaba la barra, el
          clic fuera no encontraba velo que pulsar, y ese clic se llevaba el foco
          al body dejando la paleta abierta con el scroll bloqueado. */}
      {abierto && createPortal(
        <div
          className="fixed inset-0 z-[60] bg-zinc-900/30 dark:bg-black/50 backdrop-blur-md px-4 pt-[10vh] sm:pt-[14vh]"
          // El velo cierra al pulsarlo, pero solo si el clic empieza Y acaba en
          // él: sin esta comprobación, arrastrar para seleccionar texto dentro
          // del panel y soltar fuera cerraba la paleta y borraba la búsqueda.
          onMouseDown={(e) => { if (e.target === e.currentTarget) cerrar() }}
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={t.ariaSearch}
            onKeyDown={teclas}
            className="mx-auto w-full max-w-[640px] border border-linea bg-white dark:bg-zinc-950 shadow-2xl shadow-zinc-900/20 dark:shadow-black/60"
          >
            <div className="flex items-center gap-3 px-4 border-b border-linea">
              <Search size={17} className="shrink-0 text-tinta-suave" />
              <input
                ref={campoRef}
                type="text"
                role="combobox"
                aria-expanded={hayConsulta}
                aria-controls="buscadorLista"
                aria-activedescendant={hayConsulta && planos[activo] ? `res-${activo}` : undefined}
                aria-label={t.ariaSearch}
                autoComplete="off"
                spellCheck="false"
                value={consulta}
                onChange={(e) => setConsulta(e.target.value)}
                placeholder={t.buscarTodoPh}
                className="flex-1 min-w-0 h-14 bg-transparent text-base text-tinta placeholder:text-tinta-suave outline-none"
              />
              <span className="font-mono text-[11px] text-tinta-suave select-none">esc</span>
            </div>

            {hayConsulta && (
              <div
                ref={listaRef}
                id="buscadorLista"
                role="listbox"
                aria-label={t.ariaSearch}
                className="max-h-[52vh] overflow-y-auto py-2"
              >
                {planos.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-tinta-suave">
                    {t.buscarNada}
                  </div>
                ) : (
                  grupos.map((g) => (
                    <div key={g.seccion}>
                      <div className="px-4 pt-2 pb-1 font-mono text-[11px] uppercase tracking-wider text-tinta-suave">
                        {t.nav[g.seccion]}
                      </div>
                      {g.items.map((item) => {
                        indiceGlobal++
                        const i = indiceGlobal
                        const señalado = i === activo
                        return (
                          <button
                            key={`${g.seccion}-${item.clave}`}
                            id={`res-${i}`}
                            role="option"
                            aria-selected={señalado}
                            data-activo={señalado}
                            onMouseEnter={() => setActivo(i)}
                            onClick={() => elegir(item)}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-left cursor-pointer transition-colors ${
                              señalado ? 'bg-zinc-100 dark:bg-zinc-900' : ''
                            }`}
                          >
                            {/* El mismo distintivo que en la rejilla: una barra con el color
                                del lenguaje. El emoji quedaba de otra web, y además cada
                                sistema operativo dibuja el suyo. */}
                            {item.color && <span className="w-1 h-4 rounded-full shrink-0" style={{ background: item.color }} />}
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-semibold text-tinta truncate">
                                {item.titulo}
                              </span>
                              {item.sub && (
                                <span className="block text-xs text-tinta-suave truncate">{item.sub}</span>
                              )}
                            </span>
                            {item.url
                              ? <ArrowUpRight size={14} className="shrink-0 text-tinta-suave" />
                              : señalado && <CornerDownLeft size={13} className="shrink-0 text-tinta-suave" />}
                          </button>
                        )
                      })}
                    </div>
                  ))
                )}
              </div>
            )}

            <div className="px-4 py-2.5 border-t border-linea font-mono text-[11px] text-tinta-suave">
              {t.buscarAyuda}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
