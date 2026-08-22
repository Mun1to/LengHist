// El poquito de formato que se permite dentro de un texto del catálogo: negritas
// con **…** y código con `…`. Nada más, a propósito: si un texto necesita más
// formato, es que ya no es una frase suelta y le toca otro sitio.
//
// Vive en `lib` y no junto a los consejos, que es de donde salió, porque lo usan
// tres cosas que no tienen nada que ver entre sí: el muro de consejos, la guía y
// el HTML que se cocina en el build. Importarlo desde `data/consejos.js` le
// colaba los treinta y ocho consejos a quien solo quería pintar una negrita.
export function trozosDe(texto) {
  return texto.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean).map((t) => {
    if (t.startsWith('**')) return { tipo: 'fuerte', texto: t.slice(2, -2) }
    if (t.startsWith('`')) return { tipo: 'codigo', texto: t.slice(1, -1) }
    return { tipo: 'texto', texto: t }
  })
}
