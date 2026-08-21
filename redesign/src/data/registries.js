// Registries de componentes de terceros que el MCP indexa y ENLAZA, nunca
// rehospeda. El MCP lee el índice (metadata pura) de cada origen y devuelve
// título, descripción y el comando de instalación del ORIGEN. El código ajeno no
// se copia ni se sirve jamás: ver LICENSING.md y la guardia de
// scripts/comprobar-registro.mjs.
//
// Campos:
// - namespace: el alias shadcn (@x) con el que se instala desde su origen.
// - indexUrl: el registry.json índice del origen. Provisional hasta la fase de
//   federación: scripts/comprobar-registro.mjs comprueba que cada uno esté vivo, y
//   si un origen cae, la búsqueda degrada a «solo lo propio» sin romperse.
// - verificado: si ya se comprobó que el indexUrl responde. Arranca en false.
// - license: la licencia declarada del origen. Da igual para la ley porque no se
//   rehospeda ninguno, pero se muestra para que quien instale sepa a qué se atiene.
export const REGISTRIES = [
  {
    key: 'shadcn',
    name: 'shadcn/ui',
    homepage: 'https://ui.shadcn.com',
    namespace: '@shadcn',
    indexUrl: 'https://ui.shadcn.com/r/registry.json',
    license: 'MIT',
    verificado: false,
    es: 'La base del ecosistema: componentes accesibles y sin estilo propio.',
    en: 'The base of the ecosystem: accessible, unstyled components.',
  },
  {
    key: 'magicui',
    name: 'Magic UI',
    homepage: 'https://magicui.design',
    namespace: '@magicui',
    indexUrl: 'https://magicui.design/r/registry.json',
    license: 'MIT',
    verificado: false,
    es: 'Componentes animados listos para marketing, sobre shadcn.',
    en: 'Animated, marketing-ready components built on shadcn.',
  },
  {
    key: 'reactbits',
    name: 'React Bits',
    homepage: 'https://reactbits.dev',
    namespace: '@reactbits',
    indexUrl: 'https://reactbits.dev/r/registry.json',
    license: 'MIT + Commons Clause',
    verificado: false,
    es: 'Colección de componentes React animados. Instalar sí, revender no.',
    en: 'A collection of animated React components. Fine to use, not to resell.',
  },
  {
    key: 'aceternity',
    name: 'Aceternity UI',
    homepage: 'https://ui.aceternity.com',
    namespace: '@aceternity',
    indexUrl: 'https://ui.aceternity.com/registry.json',
    license: 'proprietary',
    verificado: false,
    es: 'Efectos de alto impacto. Licencia propietaria: se enlaza, se instala desde su sitio.',
    en: 'High-impact effects. Proprietary licence: linked, installed from their own site.',
  },
  {
    key: 'canvas-ui',
    name: 'canvasui',
    homepage: 'https://canvasui.dev',
    namespace: '@canvas-ui',
    indexUrl: 'https://canvasui.dev/r/registry.json',
    license: 'author-terms',
    verificado: false,
    es: 'La fuente real de 9 de los 12 efectos WebGL del catálogo propio.',
    en: 'The real source of 9 of the 12 WebGL effects in the own catalogue.',
  },
]
