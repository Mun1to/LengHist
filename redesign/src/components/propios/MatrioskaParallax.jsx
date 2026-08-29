import { useCallback, useEffect, useRef, useState } from 'react'
import './propios.css'

// Matrioska parallax. Código PROPIO, portado de la receta 16 de FrontLaxWeb
// (`plantillas/vanilla/matrioska-parallax.html`, con gemela en React).
//
// El scroll deja de mover la página y pasa a mover una CÁMARA que avanza en
// línea recta por un túnel de capas. Cada capa está dentro de la anterior, como
// una muñeca rusa: no hay desplazamiento lateral, lo que crece es el mundo.
//
// LA MATEMÁTICA, QUE ES TODA LA RECETA
//   camara = progreso * (N - 1)   posición de la cámara, medida en capas
//   d      = camara - i           a cuántas capas queda la capa i
//   escala = 2 ^ d                cada capa que avanzas, el mundo duplica
// Con d = -1 la capa se ve a la mitad (está dentro de la anterior). Con d = 0 la
// cámara está justo en ella. Con d = +1 ya la ha atravesado.
//
// EL DIAL DE MOVIMIENTO comprime el recorrido en vez de apagarlo:
//   escala = 1 + (2^d - 1) * gain
// Con gain 1 el rango es [0.5, 2]; con 0.25 pasa a [0.87, 1.25], o sea el efecto
// como acento; con 0 la escala es 1 y degrada a un fundido encadenado. No se
// rompe, se queda sin trayecto. La OPACIDAD nunca se multiplica por el dial: es
// lo que sostiene el efecto cuando el dial está bajo.
//
// La diferencia con la plantilla original: allí el progreso lo da el scroll de la
// PÁGINA con `useScroll` de Motion. Aquí la demo vive dentro de una caja de 300px
// con su propio scroll, así que se mide a mano sobre ese contenedor y la pieza no
// arrastra ninguna dependencia.

const MESETA = 0.3  // radio en el que una capa manda sola, a opacidad plena

export default function MatrioskaParallax({ gain = 1, pantallasPorCapa = 1, capas, style, className = '' }) {
  const cajaRef = useRef(null)
  const [progreso, setProgreso] = useState(0)

  const medir = useCallback(() => {
    const c = cajaRef.current
    if (!c) return
    const recorrido = c.scrollHeight - c.clientHeight
    // Sin recorrido no hay nada que medir y dividir daría NaN: la primera capa
    // se queda a la vista, que es el modo legible.
    setProgreso(recorrido > 0 ? c.scrollTop / recorrido : 0)
  }, [])

  useEffect(() => { medir() }, [medir, capas.length])

  const total = capas.length
  const camara = progreso * (total - 1)

  return (
    <div style={style} className={`mp-marco ${className}`}>
      <div ref={cajaRef} className="mp-scroller" onScroll={medir}>
        {/* El espaciador es lo que da recorrido: una pantalla por capa. */}
        <div style={{ height: `${100 * (1 + (total - 1) * pantallasPorCapa)}%` }} />
      </div>

      <div className="mp-escena" aria-hidden="true">
        {capas.map((capa, i) => {
          const d = camara - i
          const escala = 1 + (Math.pow(2, d) - 1) * gain

          // La ventana de solape depende del dial, y no es capricho: con el zoom
          // completo la capa vecina se ve a la mitad y solaparla es lo que
          // produce la matrioska; con el dial bajo todas quedan casi del mismo
          // tamaño y ese solape convierte dos titulares en un borrón.
          const ventana = 0.55 + 0.6 * gain
          const t = Math.min(1, Math.max(0, (Math.abs(d) - MESETA) / (ventana - MESETA)))
          const opacidad = 1 - t * t * (3 - 2 * t)

          if (opacidad <= 0.01) return null
          return (
            <div
              key={i}
              className="mp-capa"
              style={{ transform: `scale(${escala.toFixed(4)})`, opacity: opacidad.toFixed(3) }}
            >
              {capa}
            </div>
          )
        })}
      </div>
    </div>
  )
}
