// Genera la tarjeta que sale al compartir un enlace (Open Graph, 1200x630).
//
//   pnpm tarjeta            escribe public/brand/og.png y og-en.png
//   CHROME="..." pnpm tarjeta   si Chrome no está donde se le busca
//
// Existe como script y no como PNG editado a mano porque los números son los del
// catálogo: la tarjeta anterior decía «Cien lenguajes. Una guía viva» meses
// después de que el sitio dejara de ser eso y creciera a seis secciones. Así se
// vuelve a generar en diez segundos y nunca miente sobre lo que hay dentro.
import { spawn } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const AQUI = dirname(fileURLToPath(import.meta.url))
const RAIZ = join(AQUI, '..')
const PUERTO = 9444

const CANDIDATOS_CHROME = [
  process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)

function buscarChrome() {
  const encontrado = CANDIDATOS_CHROME.find((p) => existsSync(p))
  if (!encontrado) {
    console.error('No encuentro Chrome. Pásalo con CHROME="/ruta/a/chrome" pnpm tarjeta')
    process.exit(1)
  }
  return encontrado
}

// Los números que se dibujan en la tarjeta salen de la misma cuenta que usan la
// aplicación y el texto alternativo del build, para que la imagen y su
// descripción no puedan decir cosas distintas.
async function totales() {
  const { TOTALES } = await import('../src/lib/totales.js')
  return TOTALES
}

const TEXTOS = {
  es: {
    lema: 'Todo lo que necesitas<br>para construir en la web.',
    piezas: (n) => [
      [n.langs, 'lenguajes'], [n.res, 'recursos'], [n.concepts, 'conceptos'],
      [n.comps, 'componentes'], [n.skills, 'skills'], [n.consejos, 'consejos'],
    ],
    promesa: 'Gratis · Sin registro · Sin rastreo',
  },
  en: {
    lema: 'Everything you need<br>to build for the web.',
    piezas: (n) => [
      [n.langs, 'languages'], [n.res, 'resources'], [n.concepts, 'concepts'],
      [n.comps, 'components'], [n.skills, 'skills'], [n.consejos, 'tips'],
    ],
    promesa: 'Free · No sign-up · No tracking',
  },
}

// El logo va incrustado y no enlazado: el archivo se captura desde una carpeta
// temporal y una ruta relativa se rompería.
function logoIncrustado() {
  const svg = readFileSync(join(RAIZ, 'public/brand/logo-blanco.svg'), 'utf8')
  return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64')
}

function plantilla(lang, n) {
  const t = TEXTOS[lang]
  // Tres por dos, como la retícula de secciones de la portada. En una sola fila
  // los seis se partían por donde caía y dejaban un separador colgando al final
  // de la línea.
  const piezas = t.piezas(n)
    .map(([num, etq]) => `<span class="pieza"><b>${num}</b> ${etq}</span>`)
    .join('')

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box }
  html, body { width: 1200px; height: 630px; overflow: hidden }
  body {
    font-family: 'Inter', 'Segoe UI', sans-serif;
    color: #fafafa;
    background:
      radial-gradient(760px 520px at 88% 8%, rgba(99,102,241,.30), transparent 66%),
      radial-gradient(560px 420px at 6% 96%, rgba(129,140,248,.14), transparent 62%),
      #09090b;
    position: relative;
  }
  .reticula {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px);
    background-size: 64px 64px;
    -webkit-mask-image: radial-gradient(ellipse 78% 78% at 70% 25%, #000 25%, transparent 76%);
  }
  .marco { position: absolute; inset: 0; padding: 72px 80px; display: flex; flex-direction: column }
  .cabecera { display: flex; align-items: center; gap: 26px }
  .cabecera img { width: 92px; height: 92px }
  .marca { font-size: 78px; font-weight: 900; letter-spacing: -3.5px; line-height: 1 }
  .lema {
    margin-top: 38px; font-size: 52px; font-weight: 800;
    letter-spacing: -1.6px; line-height: 1.14; max-width: 900px;
  }
  .lema em { font-style: normal; color: #818cf8 }
  .piezas {
    margin-top: auto; display: grid; grid-template-columns: repeat(3, max-content);
    gap: 16px 56px; font-family: 'JetBrains Mono', monospace; font-size: 26px; color: #a1a1aa;
  }
  .pieza b { color: #fafafa; font-weight: 700 }
  .fila {
    margin-top: 38px; padding-top: 28px; border-top: 1px solid #27272a;
    display: flex; align-items: center; justify-content: space-between;
    font-family: 'JetBrains Mono', monospace; font-size: 25px;
  }
  .promesa { color: #a1a1aa }
  .url { color: #818cf8; font-weight: 700 }
  .barra { position: absolute; left: 0; right: 0; bottom: 0; height: 10px;
    background: linear-gradient(90deg, #4f46e5, #818cf8, #4f46e5) }
</style>
</head>
<body>
  <div class="reticula"></div>
  <div class="marco">
    <div class="cabecera">
      <img src="${logoIncrustado()}" alt="">
      <div class="marca">Vibeset</div>
    </div>
    <div class="lema">${t.lema.replace('web.', '<em>web.</em>')}</div>
    <div class="piezas">${piezas}</div>
    <div class="fila">
      <span class="promesa">${t.promesa}</span>
      <span class="url">vibeset.dev</span>
    </div>
  </div>
  <div class="barra"></div>
</body>
</html>`
}

// --- Chrome por CDP, para poder esperar a que las fuentes estén de verdad ---
class Cdp {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.pend = new Map()
    ws.onmessage = (e) => {
      const m = JSON.parse(e.data)
      if (m.id && this.pend.has(m.id)) { this.pend.get(m.id)(m); this.pend.delete(m.id) }
    }
  }
  send(method, params = {}) {
    const id = ++this.id
    this.ws.send(JSON.stringify({ id, method, params }))
    return new Promise((res, rej) => this.pend.set(id, (m) => (m.error ? rej(new Error(method + ': ' + m.error.message)) : res(m.result))))
  }
}

async function capturar(chrome, perfil, htmlPath, destino) {
  const proc = spawn(chrome, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
    '--no-default-browser-check', '--force-device-scale-factor=1',
    `--remote-debugging-port=${PUERTO}`, `--user-data-dir=${perfil}`, 'about:blank',
  ], { stdio: 'ignore' })

  try {
    let destinoWs
    for (let i = 0; i < 80; i++) {
      try {
        const r = await fetch(`http://127.0.0.1:${PUERTO}/json/new?about:blank`, { method: 'PUT' })
        if (r.ok) { destinoWs = (await r.json()).webSocketDebuggerUrl; break }
      } catch { /* todavía arrancando */ }
      await new Promise((r) => setTimeout(r, 250))
    }
    if (!destinoWs) throw new Error('Chrome no respondió en el puerto de depuración')

    const ws = new WebSocket(destinoWs)
    await new Promise((r) => { ws.onopen = r })
    const cdp = new Cdp(ws)

    await cdp.send('Page.enable')
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1200, height: 630, deviceScaleFactor: 1, mobile: false,
    })
    await cdp.send('Page.navigate', { url: 'file:///' + htmlPath.replaceAll('\\', '/') })
    await new Promise((r) => setTimeout(r, 1200))

    // Sin esto la captura sale con la tipografía del sistema una de cada tres veces.
    for (let i = 0; i < 40; i++) {
      const { result } = await cdp.send('Runtime.evaluate', {
        expression: 'document.fonts.ready.then(() => document.fonts.status)',
        awaitPromise: true, returnByValue: true,
      })
      if (result.value === 'loaded') break
      await new Promise((r) => setTimeout(r, 200))
    }

    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' })
    writeFileSync(destino, Buffer.from(data, 'base64'))
    try { await cdp.send('Browser.close') } catch { /* ya se estaba cerrando */ }
  } finally {
    proc.kill()
    // Se espera a que muera de verdad: mientras viva, Windows mantiene abiertos
    // los archivos de su perfil y la carpeta temporal no se deja borrar.
    if (proc.exitCode === null) {
      await Promise.race([
        new Promise((r) => proc.once('exit', r)),
        new Promise((r) => setTimeout(r, 3000)),
      ])
    }
  }
}

const chrome = buscarChrome()
const n = await totales()
const tmp = mkdtempSync(join(tmpdir(), 'vibeset-og-'))

for (const [lang, archivo] of [['es', 'og.png'], ['en', 'og-en.png']]) {
  const html = join(tmp, `og-${lang}.html`)
  writeFileSync(html, plantilla(lang, n))
  const destino = join(RAIZ, 'public/brand', archivo)
  await capturar(chrome, join(tmp, `perfil-${lang}`), html, destino)
  console.log(`  ${archivo}  ${n.langs}/${n.res}/${n.concepts}/${n.comps}/${n.skills}/${n.consejos}`)
}

// Dentro de `tmp` hay dos perfiles enteros de Chrome, unos 26 MB por pasada, y
// nadie vacía la carpeta temporal del sistema: el 2026-08-20 había 73 MB de
// ejecuciones viejas ahí. Se reintenta porque Windows tarda un momento en
// soltar los archivos aunque el proceso ya haya muerto. Si aun así no se puede,
// no se aborta nada: es caché, y la siguiente pasada la barre.
for (let i = 0; i < 10; i++) {
  try { rmSync(tmp, { recursive: true, force: true }); break } catch { /* aún abierta */ }
  await new Promise((r) => setTimeout(r, 300))
}

console.log('\nTarjetas regeneradas desde el catálogo.')
process.exit(0)
