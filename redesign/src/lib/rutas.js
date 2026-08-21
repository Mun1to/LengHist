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

// Cada página existe en dos direcciones: la española es la de siempre y la
// inglesa cuelga de `/en`. Se hizo así, y no moviendo las dos a `/es` y `/en`,
// porque las direcciones de hoy ya están indexadas y son las que la gente tiene
// guardadas: esto AÑADE un idioma, no mueve el que había, así que no hay ni una
// redirección que mantener.
//
// Antes solo existía un juego de direcciones y el idioma vivía en el navegador,
// o sea que para un buscador la mitad inglesa del sitio no existía: no había
// ninguna URL que indexar ni ninguna señal de que estuviera ahí.
export const IDIOMAS = ['es', 'en']
const PREFIJO = { es: '', en: '/en' }

export const rutaDe = (seccion, item, lang = 'es') => {
  const base = RUTA_DE_SECCION[seccion] ?? '/'
  const cuerpo = item ? `${base}/${item}` : base
  const p = PREFIJO[lang] ?? ''
  if (!p) return cuerpo
  // La portada inglesa es `/en` a secas y no `/en/`: el build escribe un archivo
  // plano por dirección, y con carpeta más índice Cloudflare Pages responde 308
  // hacia la barra final.
  return cuerpo === '/' ? p : p + cuerpo
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
  let limpio = pathname.replace(/\/+$/, '') || '/'

  // El idioma también lo dice la dirección, igual que la sección y la ficha. Sin
  // prefijo es español, que es donde han estado siempre estas páginas.
  let lang = 'es'
  if (limpio === '/en' || limpio.startsWith('/en/')) {
    lang = 'en'
    limpio = limpio.slice(3) || '/'
  }

  const seccion = SECCION_DE_RUTA[limpio]
  if (seccion) return { seccion, ficha: null, lang }

  const corte = limpio.lastIndexOf('/')
  const padre = limpio.slice(0, corte) || '/'
  const ficha = decodeURIComponent(limpio.slice(corte + 1))
  const seccionPadre = SECCION_DE_RUTA[padre]
  // La portada no tiene fichas colgando, así que `/inventado` no es «la portada
  // con una ficha rara»: es una dirección que no existe. Sin esta comprobación
  // cualquier palabra suelta se leía como la portada, y el 404 solo llegaba
  // porque el servidor no encontraba el archivo.
  if (seccionPadre && seccionPadre !== 'home' && ficha) return { seccion: seccionPadre, ficha, lang }

  return { seccion: null, ficha: null, lang }
}

// La MISMA página en el otro idioma. Lo usan el botón del pie, que navega en vez
// de cambiar un estado, y las etiquetas `hreflang` que le dicen a un buscador
// que estas dos direcciones son la misma cosa dicha de dos maneras.
export function traducirRuta(pathname, lang) {
  const { seccion, ficha } = leerRuta(pathname)
  if (!seccion) return rutaDe('home', null, lang)
  return rutaDe(seccion, ficha, lang)
}
