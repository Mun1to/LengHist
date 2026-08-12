// Resaltado de sintaxis propio para los ejemplos de la web. Sin dependencias:
// un resaltador de verdad (Prism, Shiki) pesa más que todos los ejemplos juntos,
// y aquí solo hacen falta tres lenguajes y un puñado de tipos de token.
//
// Devuelve pares [tipo, texto]. La regla que no se rompe nunca: al concatenar
// los textos sale exactamente el código de entrada, sin perder ni un carácter.

const CLAVES_JS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'of', 'in',
  'new', 'class', 'extends', 'export', 'import', 'from', 'default', 'async', 'await',
  'try', 'catch', 'finally', 'throw', 'typeof', 'instanceof', 'delete', 'void',
  'true', 'false', 'null', 'undefined', 'this', 'super',
])

// Objetos del navegador que conviene distinguir de una variable cualquiera.
const GLOBALES_JS = new Set([
  'document', 'window', 'console', 'Math', 'CSS', 'performance', 'navigator', 'location',
  'JSON', 'Object', 'Array', 'Promise', 'scrollY', 'scrollX', 'innerWidth', 'innerHeight',
])

const RE_JS =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(`(?:\\[\s\S]|[^`\\])*`|'(?:\\[\s\S]|[^'\\])*'|"(?:\\[\s\S]|[^"\\])*")|(\b\d[\w.]*)|([A-Za-z_$][\w$]*)|(=>|\.\.\.|[{}()[\]:;,.=+\-*/%!<>&|?])/g

const RE_CSS =
  /(\/\*[\s\S]*?\*\/)|('(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*")|(@[\w-]+)|(#[0-9a-fA-F]{3,8}\b)|(-?(?:\d[\w.%]*|\.\d[\w.%]*))|([.#][A-Za-z_-][\w-]*)|(--[\w-]+)|([A-Za-z_][\w-]*)|([{}()])/g

const RE_HTML =
  /(<!--[\s\S]*?-->)|(<\/?[A-Za-z][\w:-]*)|('[^']*'|"[^"]*")|([A-Za-z_:][\w:.-]*)(?=\s*=)|(\/?>)/g

// Qué carácter va después, saltando los espacios. Sirve para saber si un nombre
// es una llamada a función, una propiedad CSS o un selector.
function siguiente(src, desde) {
  let i = desde
  while (i < src.length && /\s/.test(src[i])) i++
  return src[i] ?? ''
}

function anterior(src, hasta) {
  let i = hasta - 1
  while (i >= 0 && /\s/.test(src[i])) i--
  return src[i] ?? ''
}

// Recorre con la expresión maestra y deja como texto plano todo lo que no encaje
// en ninguna regla, que es lo que garantiza que no se pierda nada por el camino.
function recorrer(src, re, clasificar) {
  const salida = []
  let pos = 0
  re.lastIndex = 0
  for (const m of src.matchAll(re)) {
    if (m.index > pos) salida.push(['', src.slice(pos, m.index)])
    salida.push(clasificar(m, src))
    pos = m.index + m[0].length
  }
  if (pos < src.length) salida.push(['', src.slice(pos)])
  return salida
}

function tokensJs(src) {
  return recorrer(src, RE_JS, (m, s) => {
    const [txt, com, cad, num, nombre, pun] = m
    if (com) return ['com', txt]
    if (cad) return ['str', txt]
    if (num) return ['num', txt]
    if (nombre) {
      if (CLAVES_JS.has(nombre)) return ['key', txt]
      if (siguiente(s, m.index + txt.length) === '(') return ['fn', txt]
      if (GLOBALES_JS.has(nombre)) return ['glo', txt]
      if (anterior(s, m.index) === '.') return ['pro', txt]
      return ['', txt]
    }
    if (pun) return ['pun', txt]
    return ['', txt]
  })
}

function tokensCss(src) {
  let bloque = 0   // dentro de { }
  let parens = 0   // dentro de ( ), como en @media (...)
  return recorrer(src, RE_CSS, (m, s) => {
    const [txt, com, cad, arroba, hex, num, clase, variable, nombre, llave] = m
    if (com) return ['com', txt]
    if (cad) return ['str', txt]
    if (arroba) return ['at', txt]
    if (hex) return ['num', txt]
    if (num) return ['num', txt]
    if (clase) return [bloque === 0 ? 'sel' : '', txt]
    if (variable) return ['pro', txt]
    if (nombre) {
      const sig = siguiente(s, m.index + txt.length)
      if (sig === '(') return ['fn', txt]
      if (sig === ':' && (bloque > 0 || parens > 0)) return ['pro', txt]
      if (sig === '{') return ['sel', txt]
      return [bloque === 0 ? 'sel' : '', txt]
    }
    if (llave) {
      if (txt === '{') bloque++
      else if (txt === '}') bloque = Math.max(0, bloque - 1)
      else if (txt === '(') parens++
      else if (txt === ')') parens = Math.max(0, parens - 1)
      return ['pun', txt]
    }
    return ['', txt]
  })
}

function tokensHtml(src) {
  return recorrer(src, RE_HTML, (m) => {
    const [txt, com, etiqueta, cad, attr, cierre] = m
    if (com) return ['com', txt]
    if (etiqueta) return ['sel', txt]
    if (cad) return ['str', txt]
    if (attr) return ['pro', txt]
    if (cierre) return ['sel', txt]
    return ['', txt]
  })
}

const POR_LENGUAJE = { js: tokensJs, css: tokensCss, html: tokensHtml }

// Un token puede llevar saltos de línea dentro (comentarios de bloque, plantillas).
// Se parten aquí para poder pintar el código línea a línea, que es lo que permite
// envolver las líneas largas con sangría en vez de esconderlas tras un scroll.
export function lineasResaltadas(codigo, lenguaje = 'js') {
  const tokens = (POR_LENGUAJE[lenguaje] ?? tokensJs)(codigo)
  const lineas = [[]]
  for (const [tipo, texto] of tokens) {
    const trozos = texto.split('\n')
    trozos.forEach((trozo, i) => {
      if (i > 0) lineas.push([])
      if (trozo) lineas[lineas.length - 1].push([tipo, trozo])
    })
  }
  return lineas
}
