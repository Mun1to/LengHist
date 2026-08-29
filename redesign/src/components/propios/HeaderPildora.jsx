import { useCallback, useEffect, useRef } from 'react'
import './HeaderPildora.css'

// Header de píldora deslizante. Código PROPIO, no de canvasui ni de arlan: es la
// primera pieza de la casa que sale al catálogo, portada desde el original en
// HTML de `FrontLaxWeb/Components/snippets/header-pildora-deslizante.html`.
//
// Lo genérico es dar a cada item su propio fondo, y entonces el ojo ve cinco
// luces encendiéndose y apagándose, que no significan nada. Con un único objeto
// que se mueve, el ojo lee continuidad: es la misma cosa, que ahora está en otro
// sitio. Cuesta lo mismo y comunica más.
//
// Los dos detalles que separan esto de la versión de andar por casa:
//
//   1. La mueve un SPRING, no una transición. Al recorrer el menú deprisa
//      redirige a media trayectoria en vez de encadenar viajes, porque el muelle
//      guarda la velocidad que ya llevaba.
//   2. El radio se DIVIDE POR LA ESCALA en cada frame. Sin esa compensación, al
//      escalar en X la píldora se deforma en elipse y se nota enseguida.

const BASE_ANCHO = 100
const ALTO = 36

export default function HeaderPildora({
  respuesta = 0.34,
  amortiguacion = 0.68,
  gain = 1,
  items,
  style,
  className = '',
}) {
  const menuRef = useRef(null)
  const pildoraRef = useRef(null)
  // Todo el estado del muelle vive en un ref: cambia sesenta veces por segundo y
  // pasarlo por el estado de React repintaría el árbol entero en cada frame.
  const m = useRef({ x: 0, w: BASE_ANCHO, vx: 0, vw: 0, dx: 0, dw: BASE_ANCHO, corriendo: false, visible: false, t0: 0 })

  const pintar = useCallback(() => {
    const p = pildoraRef.current
    if (!p) return
    const s = m.current
    const sx = s.w / BASE_ANCHO
    p.style.transform = `translateX(${s.x.toFixed(2)}px) scaleX(${sx.toFixed(4)})`
    p.style.borderRadius = `${(ALTO / 2 / sx).toFixed(2)}px / ${ALTO / 2}px`
  }, [])

  const senalar = useCallback((enlace) => {
    if (!enlace) return
    const s = m.current
    s.dx = enlace.offsetLeft
    s.dw = enlace.offsetWidth

    // Si la píldora no estaba en pantalla, se COLOCA, no viaja: venir volando
    // desde la esquina sería un movimiento que nadie ha pedido. Con el dial a
    // cero, todo cambio es una colocación.
    if (!s.visible || gain === 0) {
      s.x = s.dx; s.w = s.dw; s.vx = 0; s.vw = 0
      pintar()
    }
    s.visible = true
    menuRef.current?.classList.add('senalado')

    if (gain === 0 || s.corriendo) return
    s.corriendo = true
    s.t0 = 0

    // El dial retira el REBOTE subiendo la amortiguación, no el viaje: la
    // distancia la deciden los items y apunta el visitante, así que acortarla
    // rompería la función de la pieza.
    const damping = 1 - (1 - amortiguacion) * gain
    const f = (2 * Math.PI) / respuesta

    const paso = (t) => {
      if (!s.t0) s.t0 = t
      const dt = Math.min((t - s.t0) / 1000, 1 / 30)
      s.t0 = t

      s.vx += (-(f * f) * (s.x - s.dx) - 2 * damping * f * s.vx) * dt
      s.vw += (-(f * f) * (s.w - s.dw) - 2 * damping * f * s.vw) * dt
      s.x += s.vx * dt
      s.w += s.vw * dt

      // El bucle se apaga solo al llegar: nada de un rAF eterno de fondo.
      if (Math.abs(s.x - s.dx) < 0.3 && Math.abs(s.vx) < 0.3 &&
          Math.abs(s.w - s.dw) < 0.3 && Math.abs(s.vw) < 0.3) {
        s.x = s.dx; s.w = s.dw; s.vx = 0; s.vw = 0
        pintar()
        s.corriendo = false
        return
      }
      pintar()
      requestAnimationFrame(paso)
    }
    requestAnimationFrame(paso)
  }, [gain, respuesta, amortiguacion, pintar])

  const soltar = useCallback(() => {
    m.current.visible = false
    menuRef.current?.classList.remove('senalado')
  }, [])

  // Si cambia el ancho, las medidas guardadas dejan de valer.
  useEffect(() => {
    const alRedimensionar = () => {
      const menu = menuRef.current
      if (!menu || !m.current.visible) return
      const activo = menu.querySelector('a:hover') || document.activeElement
      if (menu.contains(activo)) senalar(activo)
    }
    window.addEventListener('resize', alRedimensionar)
    return () => window.removeEventListener('resize', alRedimensionar)
  }, [senalar])

  useEffect(() => { pintar() }, [pintar])

  return (
    <div style={style} className={`hp-marco ${className}`}>
      <div className="hp-barra">
        <nav
          ref={menuRef}
          className="hp-menu"
          aria-label="Principal"
          onPointerLeave={soltar}
          onBlur={(e) => { if (!menuRef.current?.contains(e.relatedTarget)) soltar() }}
        >
          <span ref={pildoraRef} className="hp-pildora" aria-hidden="true" />
          {items.map((texto) => (
            <a
              key={texto}
              href="#0"
              onClick={(e) => e.preventDefault()}
              onPointerEnter={(e) => senalar(e.currentTarget)}
              onFocus={(e) => senalar(e.currentTarget)}
            >
              {texto}
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}
