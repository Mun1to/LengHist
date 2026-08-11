import { useEffect, useState } from 'react'

// html-in-canvas es experimental (Chrome, tras activar la bandera de funciones
// web experimentales). Sin ella Cloth y Bubble corren igual, pero no pueden
// capturar el HTML de debajo: pintan su propio color.
export default function useHtmlInCanvas() {
  const [ok, setOk] = useState(true)

  useEffect(() => {
    setOk(
      typeof CanvasRenderingContext2D !== 'undefined' &&
      'drawElementImage' in CanvasRenderingContext2D.prototype,
    )
  }, [])

  return ok
}
