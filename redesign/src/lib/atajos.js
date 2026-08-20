// El atajo del buscador no se escribe a mano en ningún texto: en un Mac es ⌘K y
// en el resto Ctrl K, y la página del 404 lo tenía escrito fijo como «Ctrl K»,
// que en un Mac es sencillamente falso.
//
// Se lee del navegador en un efecto y no al pintar, para que el HTML del
// servidor y el primer pintado del cliente digan lo mismo: el build cocina cada
// página con contenido dentro (ver `contenidoEstatico.js`), y adivinar aquí el
// sistema operativo dejaría los dos textos distintos.
export const esMac = () =>
  typeof navigator !== 'undefined' &&
  /Mac|iPhone|iPad|iPod/.test(navigator.userAgentData?.platform || navigator.platform || '')

export const atajoBuscar = (mac) => (mac ? '\u2318K' : 'Ctrl K')
