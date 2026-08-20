import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const BASE = 'https://vibeset.dev'

// La lista de direcciones del sitio, sacada del propio catálogo. La usan el
// sitemap y el prerenderizado del meta, así que vive una sola vez: si se añade
// un lenguaje, las dos cosas se enteran.
async function rutasDelSitio() {
  const { LANGUAGES } = await import('./src/data/languages.js')
  const { COMPONENT_ITEMS } = await import('./src/data/components.js')
  const { SKILL_ITEMS } = await import('./src/data/skills.js')
  const { rutaDe, slugClave, slugLenguaje } = await import('./src/lib/rutas.js')

  return [
    { ruta: '/', prioridad: '1.0', vista: 'home', ficha: null },
    ...['languages', 'resources', 'concepts', 'components', 'skills', 'consejos']
      .map((s) => ({ ruta: rutaDe(s), prioridad: '0.9', vista: s, ficha: null })),
    ...LANGUAGES.map((l) => ({
      ruta: rutaDe('languages', slugLenguaje(l.name)), prioridad: '0.7', vista: 'languages', ficha: l,
    })),
    ...COMPONENT_ITEMS.map((c) => ({
      ruta: rutaDe('components', slugClave(c.key)), prioridad: '0.7', vista: 'components', ficha: c,
    })),
    ...SKILL_ITEMS.map((s) => ({
      ruta: rutaDe('skills', slugClave(s.key)), prioridad: '0.7', vista: 'skills', ficha: s,
    })),
  ]
}

// El sitemap se genera del propio catálogo en cada build, no a mano: son 136
// direcciones y una lista escrita a mano se queda vieja en cuanto se añade un
// lenguaje. Se emite al dist, así que no hay un archivo generado versionado.
function sitemap() {
  return {
    name: 'vibeset-sitemap',
    async generateBundle() {
      const rutas = await rutasDelSitio()
      const hoy = new Date().toISOString().slice(0, 10)
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rutas.map(({ ruta, prioridad }) => `  <url>
    <loc>${BASE}${ruta}</loc>
    <lastmod>${hoy}</lastmod>
    <priority>${prioridad}</priority>
  </url>`).join('\n')}
</urlset>
`

      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: xml })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`,
      })
      console.log(`\n  sitemap.xml con ${rutas.length} direcciones`)
    },
  }
}

const escapar = (s) => String(s)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

// Lo que la tarjeta social dice que hay, contado del catálogo. Misma cuenta que
// `scripts/tarjeta-social.mjs`, que es quien dibuja esos números en la imagen.
async function altDeLaTarjeta() {
  const { LANGUAGES } = await import('./src/data/languages.js')
  const { RESOURCES } = await import('./src/data/resources.js')
  const { CONCEPTS } = await import('./src/data/concepts.js')
  const { COMPONENT_ITEMS } = await import('./src/data/components.js')
  const { SKILL_ITEMS } = await import('./src/data/skills.js')
  const { CONSEJOS } = await import('./src/data/consejos.js')
  const suma = (grupos) => grupos.reduce((n, g) => n + g.items.length, 0)

  return `Vibeset · ${LANGUAGES.length} lenguajes, ${suma(RESOURCES)} recursos, `
    + `${suma(CONCEPTS)} conceptos, ${COMPONENT_ITEMS.length} componentes, `
    + `${SKILL_ITEMS.length} skills y ${CONSEJOS.length} consejos`
}

// Escribe un HTML por dirección con su título, su descripción, sus datos
// estructurados y su contenido ya dentro.
//
// Son dos problemas distintos que se arreglan en el mismo sitio:
//
// 1. El meta lo ponía solo React al arrancar, y los robots que dibujan la vista
//    previa de un enlace (X, Slack, LinkedIn, WhatsApp, Discord) no ejecutan
//    JavaScript: leían el HTML crudo y las 136 direcciones les decían lo mismo,
//    el título de la portada. Compartir una ficha concreta no servía de nada.
// 2. El cuerpo era `<div id="root"></div>` y punto. Los robots que responden
//    preguntas (Claude, ChatGPT, Perplexity) tampoco ejecutan JavaScript, así
//    que llegaban a `/languages/python` y no encontraban ni una palabra del
//    catálogo. Eso se arregla desde el 2026-08-17 cocinando el contenido en
//    `#pre` (ver `src/lib/contenidoEstatico.js`).
//
// Sigue sin ser renderizado en servidor: no se ejecuta React ni un componente.
// Es el mismo contenido escrito en HTML plano desde los archivos de `data/`, y
// `main.jsx` lo borra al montar.
//
// Se escribe `languages/rust.html` y NO `languages/rust/index.html`, y la
// diferencia no es de gusto: con la carpeta, Cloudflare Pages responde a
// `/languages/rust` con un **308 hacia `/languages/rust/`**, así que todos los
// enlaces publicados y las 136 entradas del sitemap se comían un salto y además
// discrepaban del `canonical` que va dentro, que no lleva barra. Con el archivo
// suelto, `/languages/rust` se sirve con un 200 directo.
function prerenderMeta() {
  let outDir

  return {
    name: 'vibeset-prerender-meta',
    apply: 'build',
    configResolved(config) { outDir = config.build.outDir },
    async closeBundle() {
      const { I18N } = await import('./src/data/i18n.js')
      const { metaDePagina } = await import('./src/lib/meta.js')
      const { contenidoDePagina, jsonLdDePagina } = await import('./src/lib/contenidoEstatico.js')

      // El texto alternativo de la tarjeta social es el único meta que no
      // depende de la ruta, así que se quedaba escrito a mano en el index.html
      // y envejecía en silencio: el 2026-08-20 decía 64 recursos y 17 skills
      // cuando ya había 72 y 18. Se cuenta del catálogo, como la propia imagen
      // (`pnpm tarjeta`), que es lo que describe.
      const alt = await altDeLaTarjeta()

      // El HTML servido se declara en español, así que el meta cocinado va en
      // español. El inglés lo elige el visitante y llega después de React, que
      // es tarde para el robot: eso solo se arregla de verdad con direcciones
      // por idioma, y esa es otra decisión.
      const lang = 'es'
      const t = I18N[lang]

      const plantilla = readFileSync(join(outDir, 'index.html'), 'utf8')

      // La página de «aquí no hay nada» se sirve desde el propio Cloudflare
      // Pages cuando la dirección no existe, así que se cocina como una más.
      const rutas = [...await rutasDelSitio(), { ruta: '/404', vista: '404', ficha: null }]
      let escritas = 0

      for (const { ruta, vista, ficha } of rutas) {
        const { titulo, descripcion } = metaDePagina({ vista, ficha, lang, t })
        const url = BASE + ruta
        const datos = jsonLdDePagina({ vista, ficha, lang, t, base: BASE, url, titulo, descripcion })
        const jsonLd = `<script type="application/ld+json">${
          JSON.stringify({ '@context': 'https://schema.org', '@graph': datos })
            .replaceAll('<', '\\u003c')
        }</script>`

        const html = plantilla
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapar(titulo)}</title>`)
          .replace(/(<meta name="description" content=")[^"]*(")/, `$1${escapar(descripcion)}$2`)
          .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${escapar(titulo)}$2`)
          .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${escapar(descripcion)}$2`)
          .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${escapar(titulo)}$2`)
          .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${escapar(descripcion)}$2`)
          .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${escapar(url)}$2`)
          .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${escapar(url)}$2`)
          .replace(/(<meta property="og:image:alt" content=")[^"]*(")/, `$1${escapar(alt)}$2`)
          .replace('</head>', `${jsonLd}</head>`)
          .replace('<div id="pre"></div>',
            `<div id="pre">${contenidoDePagina({ vista, ficha, lang, t })}</div>`)

        // La portada es el index.html de la raíz, no un archivo aparte: si se
        // escribiera `/.html` no lo serviría nadie.
        const destino = ruta === '/'
          ? join(outDir, 'index.html')
          : join(outDir, ruta.replace(/^\//, '') + '.html')

        mkdirSync(dirname(destino), { recursive: true })
        writeFileSync(destino, html)
        escritas++
      }

      console.log(`  contenido y meta cocinados en ${escritas} direcciones`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), sitemap(), prerenderMeta()],
  server: { port: 5183, strictPort: true },
})
