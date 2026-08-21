import { LANGUAGES } from '../data/languages.js'
import { codeFor } from '../data/codeEn.js'

// Los cuatro lenguajes que enseña la ventana de código de la portada, ya
// resueltos y con su ejemplo en los dos idiomas.
//
// **Por qué no se leen del catálogo en el navegador.** `CodeWindow` necesitaba
// cuatro lenguajes y para tenerlos importaba `data/languages.js` entero, o sea
// los cien, que son la mitad del peso de esta web. Como está en la portada, todo
// el que entraba se bajaba el catálogo completo para ver una ventana con cuatro
// pestañas.
//
// Igual que con los contadores, esto se resuelve en el BUILD: el plugin
// `datosDePortadaEnBuild` de vite.config.js sustituye este módulo por el objeto
// ya calculado. La fuente sigue siendo el catálogo y no hay nada escrito a mano;
// lo único que cambia es cuándo se busca. En desarrollo se usa este archivo tal
// cual, así que si algún día uno de los cuatro nombres deja de existir, se ve
// enseguida.
export const PESTANAS = ['Python', 'JavaScript', 'Rust', 'Go']

export const EJEMPLOS_PORTADA = Object.fromEntries(
  PESTANAS.map((nombre) => {
    const l = LANGUAGES.find((x) => x.name === nombre)
    if (!l) throw new Error(`la portada pide el lenguaje «${nombre}» y no está en el catálogo`)
    return [nombre, {
      name: l.name,
      year: l.year,
      pop: l.pop,
      color: l.color,
      es: codeFor(l, 'es'),
      en: codeFor(l, 'en'),
    }]
  }),
)
