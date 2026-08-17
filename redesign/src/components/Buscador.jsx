import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, ArrowUpRight, CornerDownLeft } from 'lucide-react'
import { construirIndice, buscar } from '../data/buscador'

// Buscador del centro del header: mira en los cinco catálogos a la vez, no solo
// en la sección abierta. Se maneja entero con el teclado y se abre con ⌘K / Ctrl+K.

const esMac = () =>
  typeof navigator !== 'undefined' &&
  /Mac|iPhone|iPad|iPod/.test(navigator.userAgentData?.platform || navigator.platform || '')

export default function Buscador({ t, lang, onAbrir }) {
  const [consulta, setConsulta] = useState('')
  const [abierto, setAbierto] = useState(false)
  const [activo, setActivo] = useState(0)
  const [mac, setMac] = useState(false)
  const cajaRef = useRef(null)
  const campoRef = useRef(null)
  const listaRef = useRef(null)

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
        campoRef.current?.focus()
        campoRef.current?.select()
      }
    }
    window.addEventListener('keydown', atajo)
    return () => window.removeEventListener('keydown', atajo)
  }, [])

  // Clic fuera: cierra la lista pero no borra lo escrito.
  useEffect(() => {
    if (!abierto) return
    const fuera = (e) => { if (!cajaRef.current?.contains(e.target)) setAbierto(false) }
    document.addEventListener('pointerdown', fuera)
    return () => document.removeEventListener('pointerdown', fuera)
  }, [abierto])

  // Mantiene a la vista la fila señalada al moverse con las flechas.
  useEffect(() => {
    listaRef.current?.querySelector('[data-activo="true"]')
      ?.scrollIntoView({ block: 'nearest' })
  }, [activo, grupos])

  const elegir = (entrada) => {
    if (!entrada) return
    setAbierto(false)
    setConsulta('')
    campoRef.current?.blur()
    onAbrir(entrada)
  }

  const teclas = (e) => {
    if (e.key === 'Escape') { setAbierto(false); campoRef.current?.blur(); return }
    if (!planos.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActivo((i) => (i + 1) % planos.length) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActivo((i) => (i - 1 + planos.length) % planos.length) }
    else if (e.key === 'Enter') { e.preventDefault(); elegir(planos[activo]) }
  }

  const hayConsulta = consulta.trim().length >= 2
  const desplegado = abierto && hayConsulta
  let indiceGlobal = -1

  return (
    <div ref={cajaRef} className="relative w-full">
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-tinta-suave pointer-events-none" />
        <input
          ref={campoRef}
          type="text"
          role="combobox"
          aria-expanded={desplegado}
          aria-controls="buscadorLista"
          aria-activedescendant={desplegado && planos[activo] ? `res-${activo}` : undefined}
          aria-label={t.ariaSearch}
          autoComplete="off"
          spellCheck="false"
          value={consulta}
          onChange={(e) => { setConsulta(e.target.value); setAbierto(true) }}
          onFocus={() => setAbierto(true)}
          onKeyDown={teclas}
          placeholder={t.buscarTodoPh}
          className="w-full h-9 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-linea pl-9 pr-4 sm:pr-14 text-sm text-tinta placeholder:text-tinta-suave outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-950 transition-colors"
        />
        {/* El atajo es una pista, no un control: texto suelto, sin caja */}
        <span className="hidden sm:block absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[10px] text-tinta-suave pointer-events-none select-none">
          {mac ? '⌘K' : 'Ctrl K'}
        </span>
      </div>

      {desplegado && (
        <div
          ref={listaRef}
          id="buscadorLista"
          role="listbox"
          aria-label={t.ariaSearch}
          className="absolute left-0 right-0 top-11 max-h-[70vh] overflow-y-auto rounded-xl border border-linea bg-white dark:bg-zinc-950 shadow-2xl shadow-zinc-900/10 dark:shadow-black/50 py-2"
        >
          {planos.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-tinta-suave">
              {t.buscarNada}
            </div>
          ) : (
            <>
              {grupos.map((g) => (
                <div key={g.seccion}>
                  <div className="px-4 pt-2 pb-1 font-mono text-[10px] uppercase tracking-wider text-tinta-suave">
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
                          señalado ? 'bg-indigo-500/10' : ''
                        }`}
                      >
                        {/* El mismo distintivo que en la rejilla: una barra con el color del
                            lenguaje. El emoji quedaba de otra web, y además cada sistema
                            operativo dibuja el suyo. */}
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
              ))}
              <div className="px-4 pt-2 mt-1 border-t border-linea font-mono text-[10px] text-tinta-suave">
                {t.buscarAyuda}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
