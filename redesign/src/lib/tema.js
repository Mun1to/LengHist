import { useEffect } from 'react'

// El tema sigue al sistema y punto: no hay interruptor, ni preferencia guardada,
// ni tres estados que recordar. Decisión de Munir el 2026-08-20, y es la
// política de la casa desde julio: la web se pone como el sistema del visitante,
// en vivo, sin que tenga que tocar nada.
//
// Lo que se pierde al quitarlo, dicho para que nadie lo redescubra a base de
// quejas: **en la sección de componentes ya no se puede mirar un efecto en el
// tema contrario al del sistema**, y quien viene a copiar una pieza a veces
// necesita justo eso. Si algún día pesa, el interruptor va en la ficha del
// componente, que es donde hace falta, y no en la barra de toda la web.
//
// El seguimiento EN VIVO no es un extra: sin interruptor, quien cambie su
// sistema con la pestaña abierta se quedaría atrapado en el tema anterior hasta
// recargar, y ahora no tiene ningún botón con el que salir de ahí.

// Una sola consulta para todo el módulo, y no una por cada montaje. `matchMedia`
// devuelve un objeto NUEVO en cada llamada (comprobado: dos llamadas seguidas no
// son la misma instancia), así que una consulta por sitio son varios objetos
// distintos escuchando lo mismo sin saberlo.
//
// **Aviso para quien intente probar esto con un navegador automatizado:** no se
// puede, y se perdió un rato averiguándolo. `emulateMedia` de Playwright cambia
// el valor de la media query pero NO emite el evento `change` (medido: el
// listener recibe 0 eventos), y disparar el evento a mano desde la página tampoco
// sirve, porque el módulo que se importa desde ahí es otra copia distinta de la
// que cargó la aplicación. Lo que sí está comprobado es que `aplicarTema()` pone
// `dark` con el sistema en oscuro y `light` con el sistema en claro. El puente
// del evento se prueba a mano: cambiar el tema de Windows con la pestaña abierta.
export const CONSULTA_OSCURO =
  typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null

const sistemaEsOscuro = () => CONSULTA_OSCURO?.matches === true

// Pinta el tema en el html. El mismo cálculo lo hace el script en línea del
// index.html antes del primer pintado, para que no haya fogonazo blanco.
export function aplicarTema() {
  const oscuro = sistemaEsOscuro()
  const raiz = document.documentElement
  raiz.dataset.theme = oscuro ? 'dark' : 'light'
  // Sin esto, los controles nativos y la barra de scroll se quedan en el tema
  // del sistema mientras la página está en el otro.
  raiz.style.colorScheme = oscuro ? 'dark' : 'light'
}

export function useTema() {
  useEffect(() => {
    if (!CONSULTA_OSCURO) return
    aplicarTema()
    // Se envuelve en una función propia y no se pasa `aplicarTema` directamente:
    // el listener le entregaría el evento como primer argumento, y aunque hoy no
    // lo mira, el día que alguien le añada un parámetro se rompería en silencio.
    const alCambiar = () => aplicarTema()
    CONSULTA_OSCURO.addEventListener('change', alCambiar)
    return () => CONSULTA_OSCURO.removeEventListener('change', alCambiar)
  }, [])
}
