import { LANGUAGES } from '../data/languages.js'
import { RESOURCES } from '../data/resources.js'
import { CONCEPTS } from '../data/concepts.js'
import { COMPONENT_ITEMS } from '../data/components.js'
import { SKILL_ITEMS } from '../data/skills.js'
import { CONSEJOS } from '../data/consejos.js'

// Cuánto hay en cada sección, contado del catálogo. Vive aquí y no dentro de
// App porque lo necesitan la aplicación, las demos y el prerenderizado del
// build, y mientras cada uno tenía su copia el sitio llegó a anunciar dos
// cifras distintas del mismo dato: el 2026-08-20 el mismo componente decía
// «64 recursos» arriba y «72 recursos» unos píxeles más abajo.
const suma = (grupos) => grupos.reduce((n, g) => n + g.items.length, 0)

export const TOTALES = {
  langs: LANGUAGES.length,
  res: suma(RESOURCES),
  concepts: suma(CONCEPTS),
  comps: COMPONENT_ITEMS.length,
  skills: SKILL_ITEMS.length,
  consejos: CONSEJOS.length,
}

// Lo que la tarjeta social dice que hay. Lo usan el texto alternativo que
// cocina el build y la imagen que dibuja `pnpm tarjeta`, que describen lo mismo
// y por eso tienen que contarlo igual.
export const resumenDelCatalogo = (n = TOTALES) =>
  `Vibeset · ${n.langs} lenguajes, ${n.res} recursos, ${n.concepts} conceptos, `
  + `${n.comps} componentes, ${n.skills} skills y ${n.consejos} consejos`
