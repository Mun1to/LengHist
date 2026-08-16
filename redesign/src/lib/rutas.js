// Traducción entre lo que se ve en la barra de direcciones y las claves que usa
// la aplicación por dentro. Las rutas van en inglés, como el README y las claves
// de navegación; «consejos» es la única que cambia de nombre al salir.

export const SECCIONES = ['home', 'languages', 'resources', 'concepts', 'components', 'skills', 'consejos']

const RUTA_DE_SECCION = {
  home: '/',
  languages: '/languages',
  resources: '/resources',
  concepts: '/concepts',
  components: '/components',
  skills: '/skills',
  consejos: '/tips',
}

const SECCION_DE_RUTA = Object.fromEntries(
  Object.entries(RUTA_DE_SECCION).map(([seccion, ruta]) => [ruta, seccion]),
)

export const rutaDe = (seccion, item) => {
  const base = RUTA_DE_SECCION[seccion] ?? '/'
  return item ? `${base}/${item}` : base
}

// El nombre de un lenguaje no cabe tal cual en una URL: hay símbolos (C++, C#),
// barras (PL/SQL) y espacios (Standard ML). Estas cuatro reglas dan un texto
// único para los cien, y se comprueba en el test de rutas.
export function slugLenguaje(nombre) {
  return nombre
    .toLowerCase()
    .replace(/\+\+/g, 'pp')
    .replace(/#/g, 'sharp')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Las claves internas de componentes y skills vienen en camelCase (asciiObject);
// en la URL se leen mejor separadas (ascii-object).
export const slugClave = (clave) =>
  clave.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

// Devuelve qué sección está abierta y qué ficha, leyendo solo la ruta. Es la
// única fuente: la aplicación ya no guarda por su cuenta dónde está.
export function leerRuta(pathname) {
  const limpio = pathname.replace(/\/+$/, '') || '/'
  const seccion = SECCION_DE_RUTA[limpio]
  if (seccion) return { seccion, ficha: null }

  const corte = limpio.lastIndexOf('/')
  const padre = limpio.slice(0, corte) || '/'
  const ficha = decodeURIComponent(limpio.slice(corte + 1))
  const seccionPadre = SECCION_DE_RUTA[padre]
  if (seccionPadre && ficha) return { seccion: seccionPadre, ficha }

  return { seccion: null, ficha: null }
}
