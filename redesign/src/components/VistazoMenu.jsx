import { useLayoutEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { rutaDe } from '../lib/rutas'
import { vistazoDe, TOTAL_SECCION } from '../lib/vistazo'

// El asomo de una sección del menú: qué hay dentro, en grupos y con sus cifras.
//
// Es lo que hace el mega-menú de Cloudflare, y lo que arregla es concreto: hoy
// «Skills» a secas no cuenta que dentro hay 18 manuales repartidos en cuatro
// tipos, así que quien no sabe qué es entra a ciegas o no entra.
//
// **Sin colores, y esto es una regla, no una opción.** La primera versión puso
// una barrita de color por grupo y estaba mal: en esta casa el color no decora
// la navegación, y aquí además mentía, porque el mismo tono significa una
// categoría concreta dentro del catálogo y en el menú no significaba nada. Lo
// que separa y ordena son las líneas y la tipografía.
//
// **Los grupos no son enlaces, y también es a propósito.** No existe una ruta
// por categoría, así que hacerlos pulsables llevaría a los seis al mismo sitio y
// el visitante descubriría el engaño al segundo clic. Son el vistazo; la acción
// es una sola y está abajo, como el «See all products» de Cloudflare.

const FILAS = 4

// Reparte los grupos en columnas de cuatro filas. Se parte aquí y no con
// `columns` de CSS porque las columnas tienen que ser elementos de verdad para
// poder llevar la línea que las separa, que es lo que convierte esto en una
// retícula y no en tres listas sueltas puestas al lado.
function enColumnas(grupos) {
  const cols = []
  for (let i = 0; i < grupos.length; i += FILAS) cols.push(grupos.slice(i, i + FILAS))
  return cols
}

const MARGEN = 24

export default function VistazoMenu({ seccion, lang, t, onCerrar, anclaX = 0 }) {
  const ref = useRef(null)
  const [x, setX] = useState(anclaX)

  // El tope de la derecha se mide en JS y no con `calc(100vw - 100%)`, que fue
  // el primer intento y salió mal: dentro de `left`, ese `100%` es el ancho del
  // CONTENEDOR (la barra entera), no el del panel, así que la cuenta daba un
  // número negativo y el panel se pegaba al borde izquierdo en las seis
  // secciones. Aquí se mide el panel de verdad, ya montado.
  //
  // `useLayoutEffect` y no `useEffect`: corrige la posición antes de pintar, así
  // que el panel no aparece en un sitio y salta al otro.
  useLayoutEffect(() => {
    const ancho = ref.current?.offsetWidth ?? 0
    const tope = document.documentElement.clientWidth - ancho - MARGEN
    setX(Math.max(MARGEN, Math.min(anclaX, tope)))
  }, [anclaX, seccion, lang])

  const grupos = vistazoDe(seccion, lang)
  if (!grupos.length) return null

  const columnas = enColumnas(grupos)

  return (
    <div
      ref={ref}
      // Se ancla debajo de la sección que lo abre y mide lo que ocupa su
      // contenido. Antes iba a todo el ancho de la barra, y con cuatro grupos
      // dejaba dos tercios de panel vacío: un panel que ocupa la pantalla para
      // enseñar cuatro líneas parece un fallo, no una decisión.
      style={{ left: `${x}px` }}
      // No lleva rol de menú ni de diálogo: es contenido descriptivo que se
      // asoma, no una lista de opciones que haya que recorrer con las flechas.
      // Ponerle `role="menu"` le prometería a un lector de pantalla una
      // navegación por teclado que aquí no existe.
      className="absolute top-full w-max max-w-[min(56rem,calc(100vw-3rem))] border-x border-b border-linea bg-white dark:bg-zinc-950 shadow-xl shadow-zinc-900/5 dark:shadow-black/40"
    >
      {/* Las marcas de encuadre de las esquinas de abajo, el mismo lenguaje de
          plano técnico que estrenó la portada. Arriba no van: ahí el panel se
          pega a la barra y una marca en L sobre la línea del header se lee como
          una rotura. */}
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-px -left-px w-2.5 h-2.5 border-b border-l border-tinta" />
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-px -right-px w-2.5 h-2.5 border-b border-r border-tinta" />

      <div className="flex items-baseline justify-between gap-8 px-5 py-2.5 border-b border-linea">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-tinta-suave">
          {t.nav[seccion]}
        </span>
        <span className="font-mono text-[11px] text-tinta-suave tabular-nums">
          {TOTAL_SECCION[seccion]}
        </span>
      </div>

      <div className="flex">
        {columnas.map((col, i) => (
          <div
            key={col[0].clave}
            // La línea va a la izquierda de cada columna menos de la primera:
            // con borde en las dos caras, donde dos columnas se tocan salen 2px
            // y la retícula se ve sucia.
            className={`px-5 py-3 ${i > 0 ? 'border-l border-linea' : ''}`}
          >
            {col.map((g) => (
              <div key={g.clave} className="flex items-baseline gap-6 py-[3px]">
                <span className="flex-1 text-[13px] text-tinta-fuerte whitespace-nowrap">
                  {g.etiqueta}
                </span>
                <span className="font-mono text-[11px] text-tinta-suave tabular-nums">
                  {g.cuenta}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <Link
        to={rutaDe(seccion)}
        onClick={onCerrar}
        className="grupo-cta pulsable flex items-center gap-1.5 px-5 py-2.5 border-t border-linea text-[13px] font-semibold text-tinta hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
      >
        {t.vistazoVerTodo(TOTAL_SECCION[seccion], t.nav[seccion].toLowerCase())}
        <ArrowRight size={13} className="flecha-desliza" />
      </Link>
    </div>
  )
}
