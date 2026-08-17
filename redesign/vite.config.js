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

// Escribe un index.html por dirección con su título y su descripción ya dentro.
//
// El meta lo ponía solo React al arrancar, y los robots que dibujan la vista
// previa de un enlace (X, Slack, LinkedIn, WhatsApp, Discord) no ejecutan
// JavaScript: leían el HTML crudo y las 136 direcciones les decían exactamente
// lo mismo, el título de la portada. Compartir una ficha concreta, que es lo que
// hace crecer a un sitio así, no servía de nada.
//
// No es renderizado en servidor: el cuerpo sigue vacío y React monta encima
// igual que antes. Lo único que cambia es la cabecera. Cloudflare Pages sirve
// `/languages/rust/index.html` cuando le piden `/languages/rust`, y el
// `_redirects` sigue cubriendo lo que no exista.
function prerenderMeta() {
  let outDir

  return {
    name: 'vibeset-prerender-meta',
    apply: 'build',
    configResolved(config) { outDir = config.build.outDir },
    async closeBundle() {
      const { I18N } = await import('./src/data/i18n.js')
      const { metaDePagina } = await import('./src/lib/meta.js')

      // El HTML servido se declara en español, así que el meta cocinado va en
      // español. El inglés lo elige el visitante y llega después de React, que
      // es tarde para el robot: eso solo se arregla de verdad con direcciones
      // por idioma, y esa es otra decisión.
      const lang = 'es'
      const t = I18N[lang]

      const plantilla = readFileSync(join(outDir, 'index.html'), 'utf8')
      const rutas = await rutasDelSitio()
      let escritas = 0

      for (const { ruta, vista, ficha } of rutas) {
        const { titulo, descripcion } = metaDePagina({ vista, ficha, lang, t })
        const url = BASE + ruta

        const html = plantilla
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapar(titulo)}</title>`)
          .replace(/(<meta name="description" content=")[^"]*(")/, `$1${escapar(descripcion)}$2`)
          .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${escapar(titulo)}$2`)
          .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${escapar(descripcion)}$2`)
          .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${escapar(titulo)}$2`)
          .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${escapar(descripcion)}$2`)
          .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${escapar(url)}$2`)
          .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${escapar(url)}$2`)

        // La portada ya es el index.html de la raíz: reescribirlo con lo mismo
        // sobra, y tocarlo dos veces es una forma barata de romperlo.
        if (ruta === '/') continue

        const destino = join(outDir, ruta.replace(/^\//, ''), 'index.html')
        mkdirSync(dirname(destino), { recursive: true })
        writeFileSync(destino, html)
        escritas++
      }

      console.log(`  meta cocinado en ${escritas} direcciones (+ la portada)`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), sitemap(), prerenderMeta()],
  server: { port: 5183, strictPort: true },
})
