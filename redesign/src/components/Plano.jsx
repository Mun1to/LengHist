// La retícula de plano técnico: bandas a todo ancho, un canal centrado con las
// dos verticales, y las cruces en los nudos.
//
// La idea que ordena todo esto: la sensación de plano NO la da la trama de
// fondo, la dan las dos líneas verticales que recorren la página sin cortarse
// entre secciones. Por eso son dos piezas y no una: `Banda` ocupa todo el ancho
// y pone la horizontal, `Canal` va dentro, centrado, y pone las verticales. Si
// las verticales se pusieran por sección, en cada empalme se verían dos líneas
// de 1px pegadas donde debería haber una.
//
// El ancho es `calc(100% - Nrem)` y no solo `max-w`: sin ese margen, en cuanto
// la ventana baja del ancho máximo las verticales se pegan al borde del cristal
// y dejan de leerse como márgenes de un documento.

// Los nudos van en tinta, o sea negro sobre claro y blanco sobre oscuro, y no
// en el indigo de la marca. Decisión de Munir el 2026-08-20, y es la correcta
// para este catálogo: aquí el color ya significa algo (cada sección tiene el
// suyo), así que una cruz de color se lee como una categoría más en vez de como
// lo que es, que es la retícula. En monocromo la marca deja de competir.
function Cruz({ donde }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className={`pointer-events-none absolute z-10 w-[15px] h-[15px] text-tinta ${donde}`}
    >
      <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

// Las cuatro esquinas del canal. El desplazamiento de media cruz hacia fuera es
// el detalle que hace la pieza: sin él la cruz queda DENTRO de la caja y parece
// un icono decorativo suelto; con él, su centro cae justo sobre el cruce de las
// dos líneas y la retícula parece tener un nudo ahí.
export function Nudos() {
  return (
    <>
      <Cruz donde="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
      <Cruz donde="top-0 right-0 translate-x-1/2 -translate-y-1/2" />
      <Cruz donde="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
      <Cruz donde="bottom-0 right-0 translate-x-1/2 translate-y-1/2" />
    </>
  )
}

// El papel rayado va en la banda y no en el canal a propósito: lo rayado es lo
// que queda FUERA del documento, igual que en el margen de una lámina técnica.
//
// Y va en TODAS las bandas, que es lo que se decidió al verlo en pantalla:
// rayando solo el hero, el margen cambiaba de textura a media página y el corte
// se leía como un fallo de maquetación en vez de como un énfasis.
export function Banda({ children, className = '' }) {
  return (
    <div className={`w-full border-b border-linea papel-plano ${className}`}>
      {children}
    </div>
  )
}

export function Canal({ children, nudos = false, className = '' }) {
  return (
    <div
      className={`relative mx-auto w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] max-w-6xl border-x border-linea bg-zinc-50 dark:bg-zinc-950 ${className}`}
    >
      {nudos && <Nudos />}
      {children}
    </div>
  )
}

// Las cuatro esquinas en L. Señalan una pieza sin encerrarla en otro recuadro,
// que es justo lo que las hace útiles en una página que ya está llena de cajas.
// El contenedor que las lleva necesita `relative` y esquina recta: sobre una
// esquina redondeada la L flota separada del borde y se ve como un fallo.
// El envoltorio va `absolute inset-0` y no suelto: si es un span normal, dentro
// de un `grid` cuenta como un hijo más y se come una celda. Pasó al primer
// intento, y en la portada se vio como un hueco en blanco arriba a la izquierda
// con las seis secciones corridas un sitio.
export function Encuadre() {
  const lado = 'pointer-events-none absolute w-2.5 h-2.5 border-tinta'
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span className={`${lado} -top-px -left-px border-t border-l`} />
      <span className={`${lado} -top-px -right-px border-t border-r`} />
      <span className={`${lado} -bottom-px -left-px border-b border-l`} />
      <span className={`${lado} -bottom-px -right-px border-b border-r`} />
    </span>
  )
}

// La retícula del catálogo: las fichas se tocan y lo que las separa es una línea
// de 1px, no un hueco.
//
// De dónde sale. Con `gap-3` y esquina redondeada, las fichas de una fila miden
// lo que mide su contenido, así que la fila entera crece hasta la más alta y las
// demás dejan un hueco debajo. En una sección de conceptos, donde una ficha
// lleva demo y bloque de código y la de al lado tres líneas, esos huecos son
// enormes y se leen como un fallo de maquetación. Reportado por Munir el
// 2026-08-20 con una captura de dos huecos seguidos.
//
// Cómo se arregla: el hueco pasa a ser de 1px y el fondo del contenedor se ve a
// través de él, así que ESE hueco es la línea. Las celdas se estiran hasta el
// alto de su fila (comportamiento normal de una rejilla, aquí no se pisa con
// `items-start`) y no queda ningún vacío entre unas y otras.
//
// La línea de 1px exacta también se gana aquí: con un borde por ficha, donde dos
// se tocan salen dos píxeles y la retícula se ve sucia.
//
// **La línea la dibuja un `outline` y no el fondo del contenedor**, que fue el
// primer intento y tenía un fallo a la vista: si el hueco de 1px deja ver el
// fondo, la última fila incompleta deja ver ese mismo fondo en TODA la celda que
// falta, y donde debería haber nada aparece un bloque gris. Se vio en Recursos,
// que tiene grupos de ocho fichas en rejillas de tres.
//
// El `outline` no ocupa espacio y se pinta fuera de la caja, así que cae justo
// en el hueco de 1px y se solapa con el de la ficha vecina: sale una línea de un
// píxel exacto, las esquinas cierran, y donde no hay ficha no hay nada que
// pintar. El `p-px` del contenedor le deja sitio al outline del perímetro, que
// si no sobresaldría un píxel por los cuatro lados.
export function Reticula({ cols, encuadre = true, className = '', children }) {
  return (
    <div className={`reticula relative grid ${cols} gap-px p-px bg-panel ${className}`}>
      {encuadre && <Encuadre />}
      {children}
    </div>
  )
}
