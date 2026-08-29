import { useState } from 'react'
import './propios.css'

// Acordeón de preguntas frecuentes. Código PROPIO, portado del original de
// `_componentes/faq-acordeon/Faq.tsx`, que salió de la web de VoCript.
//
// Se abre una a la vez: al pulsar otra, la que estaba se cierra en el mismo
// movimiento. Eso es un solo índice en el estado, y es lo que evita el acordeón
// que se va llenando de secciones abiertas hasta que ya no se ve ninguna.
//
// Las dos decisiones que hay que respetar si alguien lo toca:
//
//   1. La respuesta SIEMPRE está en el DOM. En React es tentador no pintarla
//      hasta que se abre (`{abierta && <p>…}`), y entonces un buscador no la lee
//      nunca y la sección deja de servir para lo que sirve, que es capturar las
//      búsquedas largas. Lo que cambia al abrir es el alto y la opacidad, no la
//      existencia.
//   2. El alto se anima con una REJILLA de 0fr a 1fr, no con `max-height`. Con
//      un máximo puesto a ojo, o se queda corto y recorta las respuestas largas,
//      o se pasa y la animación va lenta al principio y de golpe al final.
//
// Lo que esta demo NO lleva, y el original sí: el bloque JSON-LD de `FAQPage`.
// Aquí sería declararle a un buscador unas preguntas frecuentes que no son de
// esta página, y en este sitio solo se declara lo que se ve.

export default function AcordeonFaq({ duracion = 400, items, titulo, style, className = '' }) {
  // Un solo índice: es lo que hace que solo haya una abierta.
  const [abierta, setAbierta] = useState(null)

  return (
    <div style={style} className={`af-marco ${className}`}>
      <div className="af-caja">
        {titulo && <h3 className="af-titulo">{titulo}</h3>}

        {items.map((item, i) => {
          const estaAbierta = abierta === i
          return (
            <div key={item.q} className="af-item">
              <button
                type="button"
                className="af-pregunta"
                aria-expanded={estaAbierta}
                aria-controls={`af-respuesta-${i}`}
                onClick={() => setAbierta(estaAbierta ? null : i)}
              >
                <span>{item.q}</span>
                <svg
                  className="af-flecha"
                  style={{
                    transitionDuration: `${duracion}ms`,
                    transform: estaAbierta ? 'rotate(180deg)' : 'none',
                  }}
                  width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"
                >
                  <path
                    d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2"
                    stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div
                id={`af-respuesta-${i}`}
                className="af-cajon"
                data-abierta={estaAbierta || undefined}
                style={{ transitionDuration: `${duracion}ms` }}
              >
                <p>{item.a}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
