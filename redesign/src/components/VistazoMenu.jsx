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
// **Los grupos no son enlaces, y es a propósito.** No existe una ruta por
// categoría, así que hacerlos pulsables llevaría a los seis al mismo sitio y el
// visitante descubriría el engaño al segundo clic. Son el vistazo; la acción es
// una sola y está abajo, como el «See all products» de Cloudflare.
export default function VistazoMenu({ seccion, lang, t, onCerrar }) {
  const grupos = vistazoDe(seccion, lang)
  if (!grupos.length) return null

  return (
    <div
      // No lleva rol de menú ni de diálogo: es contenido descriptivo que se
      // asoma, no una lista de opciones que haya que recorrer con las flechas.
      // Ponerle `role="menu"` le prometería a un lector de pantalla una
      // navegación por teclado que aquí no existe.
      className="absolute inset-x-0 top-full border-b border-linea bg-white dark:bg-zinc-950 shadow-xl shadow-zinc-900/5 dark:shadow-black/40"
    >
      <div className="mx-auto w-[calc(100%-3rem)] max-w-6xl py-5">
        <div className="flex items-baseline justify-between mb-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-tinta-suave">
            {t.nav[seccion]}
          </span>
          <span className="font-mono text-[11px] text-tinta-suave">
            {TOTAL_SECCION[seccion]}
          </span>
        </div>

        {/* Columnas que se llenan por altura y no por orden: con catorce grupos
            en tres columnas, repartirlos en orden deja la última con dos líneas
            y las otras con cinco. `columns` equilibra solo. */}
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-x-8">
          {grupos.map((g) => (
            <div
              key={g.clave}
              className="break-inside-avoid flex items-baseline gap-2.5 py-1.5"
            >
              {g.color && (
                <span
                  aria-hidden="true"
                  className="w-1 h-3 shrink-0 translate-y-px"
                  style={{ background: g.color }}
                />
              )}
              <span className="flex-1 min-w-0 truncate text-[13px] text-tinta-fuerte">
                {g.etiqueta}
              </span>
              <span className="font-mono text-[11px] text-tinta-suave tabular-nums">
                {g.cuenta}
              </span>
            </div>
          ))}
        </div>

        <Link
          to={rutaDe(seccion)}
          onClick={onCerrar}
          className="grupo-cta pulsable inline-flex items-center gap-1.5 mt-4 pt-3 border-t border-linea w-full text-[13px] font-semibold text-tinta"
        >
          {t.vistazoVerTodo(TOTAL_SECCION[seccion], t.nav[seccion].toLowerCase())}
          <ArrowRight size={13} className="flecha-desliza" />
        </Link>
      </div>
    </div>
  )
}
