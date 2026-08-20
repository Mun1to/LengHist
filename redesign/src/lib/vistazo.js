import { CATEGORIES, LANGUAGES } from '../data/languages.js'
import { RESOURCES } from '../data/resources.js'
import { CONCEPTS } from '../data/concepts.js'
import { COMPONENT_GROUPS, COMPONENT_ITEMS } from '../data/components.js'
import { SKILL_GROUPS, SKILL_ITEMS } from '../data/skills.js'
import { CONSEJO_GRUPOS, CONSEJOS } from '../data/consejos.js'

// Qué se enseña al pasar por encima de una sección del menú: sus grupos con
// cuántas fichas tiene cada uno.
//
// El dato es el contador, y no es adorno. Un menú que solo repite el nombre de
// la sección que ya estás leyendo no informa de nada; lo que ayuda a decidir por
// dónde entrar es «Sistemas, 52» frente a «Móvil, 7». Es lo mismo que ya hace el
// panel del móvil, que enseña la cifra de cada sección.
//
// Se lee del catálogo en cada arranque y no hay ninguna lista escrita a mano:
// el día que se añada una categoría, el menú se entera solo. Misma regla que
// `totales.js`.

const traducir = (label, lang) => label?.[lang] ?? label?.es ?? ''

// Cuenta cuántos elementos de una lista caen en cada grupo, y devuelve los
// grupos en su orden declarado descartando los que se quedaron vacíos: un grupo
// a cero en un menú es una promesa incumplida.
function porGrupo(grupos, items, clave, lang, color) {
  const cuenta = new Map()
  for (const item of items) cuenta.set(item[clave], (cuenta.get(item[clave]) ?? 0) + 1)
  return grupos
    .map((g) => ({ clave: g.key, etiqueta: traducir(g.label, lang), cuenta: cuenta.get(g.key) ?? 0, color: color?.(g) }))
    .filter((g) => g.cuenta > 0)
}

// Los grupos que ya traen sus elementos dentro (recursos y conceptos) no hay que
// contarlos por clave: la longitud de `items` ya es la cuenta.
const conItemsDentro = (grupos, lang, color) =>
  grupos.map((g) => ({
    clave: g.key, etiqueta: traducir(g.label, lang), cuenta: g.items.length, color: color?.(g),
  }))

export function vistazoDe(seccion, lang) {
  switch (seccion) {
    case 'languages':
      // `all` es el filtro «todos», no una categoría: en un menú que ya lleva
      // «ver los 100» abajo, repetirlo arriba es ruido.
      return CATEGORIES
        .filter((c) => c.key !== 'all')
        .map((c) => ({ clave: c.key, etiqueta: traducir(c.label, lang), cuenta: c.count, color: c.dot }))
    case 'resources':
      return conItemsDentro(RESOURCES, lang, (g) => g.dot)
    case 'concepts':
      return conItemsDentro(CONCEPTS, lang, (g) => g.color)
    case 'components':
      return porGrupo(COMPONENT_GROUPS, COMPONENT_ITEMS, 'group', lang)
    case 'skills':
      return porGrupo(SKILL_GROUPS, SKILL_ITEMS, 'group', lang)
    case 'consejos':
      return porGrupo(CONSEJO_GRUPOS, CONSEJOS, 'grupo', lang)
    default:
      return []
  }
}

// Cuántas fichas hay en la sección entera, para el pie del menú.
export const TOTAL_SECCION = {
  languages: LANGUAGES.length,
  resources: RESOURCES.reduce((n, g) => n + g.items.length, 0),
  concepts: CONCEPTS.reduce((n, g) => n + g.items.length, 0),
  components: COMPONENT_ITEMS.length,
  skills: SKILL_ITEMS.length,
  consejos: CONSEJOS.length,
}
