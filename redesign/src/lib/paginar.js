import { useEffect, useState } from 'react'

// Las listas largas se pintaban enteras. En un móvil eso dejaba el catálogo de
// lenguajes en 18.267 px de alto (21,6 pantallas) y el de conceptos en 24.072
// (28,5), sin paginar, sin final a la vista y con los filtros a veinte pantallas
// de distancia hacia arriba.
//
// Esto no es scroll infinito: el tramo siguiente lo pide la persona. Con scroll
// infinito el pie no se alcanza nunca, y aquí el pie es justo donde están el
// repositorio, la licencia y cómo aportar.
export function usePaginado(total, paso) {
  const [corte, setCorte] = useState(paso)

  // Al cambiar el filtro se vuelve al principio: si no, quien filtra después de
  // haber pedido tres tramos ve un recuento que no se corresponde con nada.
  useEffect(() => { setCorte(paso) }, [total, paso])

  return {
    corte: Math.min(corte, total),
    quedan: Math.max(0, total - corte),
    verMas: () => setCorte((n) => n + paso),
  }
}

// Corta una lista ya agrupada por el mismo número total de fichas, respetando el
// orden de los grupos y dejando fuera los que se quedan sin ninguna.
export function recortarGrupos(grupos, corte) {
  const salida = []
  let puestas = 0
  for (const g of grupos) {
    if (puestas >= corte) break
    const items = g.items.slice(0, corte - puestas)
    puestas += items.length
    if (items.length) salida.push({ ...g, items })
  }
  return salida
}
