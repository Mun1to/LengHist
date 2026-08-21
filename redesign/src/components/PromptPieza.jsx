import BotonCopiar from './BotonCopiar'

// El prompt: lo que hay que PEDIRLE a tu agente para tener esta técnica.
//
// **Por qué es la pieza que faltaba.** La ficha de un concepto ya traía tres
// cosas: qué es, el efecto funcionando y el código. Le faltaba la del medio para
// quien construye con un agente, que es la mayoría del público de este sitio: no
// necesita el código pegado, necesita saber qué pedir y, sobre todo, qué límites
// poner para que no le devuelvan algo que se ve bien y rompe otra cosa.
//
// Por eso ninguno de estos textos es «hazme un parallax». Todos dicen tres
// cosas: qué se quiere, con qué herramienta, y la trampa concreta que el agente
// se salta si no se la nombras (los enlaces de ancla que rompe el smooth scroll,
// el `overflow` de un ancestro que mata `position: sticky`, el contenido que
// desaparece de un buscador si el reveal lo esconde por defecto).
//
// Se copia entero de un botón, porque un prompt que hay que seleccionar a mano
// desde un móvil no lo usa nadie.
export default function PromptPieza({ prompt, lang, etiqueta, copiar, copiado }) {
  if (!prompt?.[lang]) return null
  const texto = prompt[lang]

  return (
    <div className="mt-3 border-t border-linea pt-3">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="font-mono text-[12px] font-bold uppercase tracking-wider text-tinta-suave">
          {etiqueta}
        </span>
        <BotonCopiar texto={texto} etiqueta={copiar} etiquetaHecho={copiado} compacto />
      </div>
      {/* Sin caja de fondo y sin esquinas: es texto para leer, no un bloque de
          código. Lo que lo separa del resto de la ficha es la línea de arriba,
          que es como se separa todo en este sitio. */}
      <p className="text-sm text-tinta-fuerte leading-relaxed">{texto}</p>
    </div>
  )
}
