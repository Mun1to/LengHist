import { useEffect, useState } from 'react'

// Una galería de componentes sin selector de tema no se puede usar: quien viene
// a mirar un efecto necesita verlo en el fondo que va a tener en SU web, y no en
// el que le toque al sistema operativo de quien mira. Tres estados, y el que
// manda por defecto sigue siendo el del sistema.
export const CLAVE_TEMA = 'vibeset-tema'
export const TEMAS = ['sistema', 'claro', 'oscuro']

export function leerPreferencia() {
  try {
    const guardado = localStorage.getItem(CLAVE_TEMA)
    if (TEMAS.includes(guardado)) return guardado
  } catch { /* navegación privada sin almacenamiento */ }
  return 'sistema'
}

const sistemaEsOscuro = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches

// Pinta el tema en el html. El mismo cálculo lo hace el script en línea del
// index.html antes del primer pintado, para que no haya fogonazo blanco.
export function aplicarTema(preferencia) {
  const oscuro = preferencia === 'oscuro' || (preferencia === 'sistema' && sistemaEsOscuro())
  const raiz = document.documentElement
  raiz.dataset.tema = oscuro ? 'oscuro' : 'claro'
  // Sin esto, los controles nativos y la barra de scroll se quedan en el tema
  // del sistema mientras la página está en el otro.
  raiz.style.colorScheme = oscuro ? 'dark' : 'light'
}

export function useTema() {
  const [preferencia, setPreferencia] = useState(leerPreferencia)

  useEffect(() => {
    aplicarTema(preferencia)
    try { localStorage.setItem(CLAVE_TEMA, preferencia) } catch { /* sin almacenamiento */ }
  }, [preferencia])

  // Con «sistema» puesto, cambiar el tema del sistema operativo tiene que
  // cambiar la página sin recargarla.
  useEffect(() => {
    if (preferencia !== 'sistema' || typeof matchMedia !== 'function') return
    const consulta = matchMedia('(prefers-color-scheme: dark)')
    const alCambiar = () => aplicarTema('sistema')
    consulta.addEventListener('change', alCambiar)
    return () => consulta.removeEventListener('change', alCambiar)
  }, [preferencia])

  const siguiente = () =>
    setPreferencia((actual) => TEMAS[(TEMAS.indexOf(actual) + 1) % TEMAS.length])

  return [preferencia, siguiente]
}
