import { ArrowUpRight } from 'lucide-react'

// «Visto en»: una web de verdad donde la técnica está funcionando hoy.
//
// **Por qué existe.** Una ficha que dice «el parallax da profundidad» es una
// descripción; «así se mueve esta web» es una prueba. Idea de un amigo de Munir,
// del mundo del networking, el 2026-08-21.
//
// **El riesgo que trae, y cómo se contiene.** Estos enlaces caducan solos: las
// webs se rediseñan y la técnica desaparece sin avisar a nadie, y una ficha que
// promete una prueba que ya no está es peor que una ficha sin prueba. Por eso
// cada pareja guarda su `prueba`, que es el marcador exacto que se buscó en el
// CSS o el HTML del sitio (`scroll-snap-type`, `@container`, `lenis`…), y
// `pnpm enlaces` lo vuelve a buscar cuando se quiera. No es un enlace suelto:
// es una afirmación que se puede volver a comprobar.
//
// **No se escribe ninguna pareja sin haberla medido.** Las catorce primeras
// salieron de bajar el HTML y las hojas de estilo de cada sitio y contar el
// marcador, no de recordar qué web usaba qué.
export default function VistoEn({ dato, lang, etiqueta }) {
  if (!dato) return null
  return (
    <p className="text-[12px] text-tinta-suave mt-3 leading-relaxed">
      <span className="font-bold uppercase tracking-wider">{etiqueta}</span>{' '}
      <a
        href={dato.url}
        target="_blank"
        rel="noopener noreferrer"
        className="pulsable inline-flex items-center gap-0.5 min-h-6 font-mono text-tinta-fuerte border-b border-linea-viva hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        {dato.sitio}
        <ArrowUpRight size={11} className="shrink-0" />
      </a>
      <span className="mx-1.5">·</span>
      {dato[lang]}
    </p>
  )
}
