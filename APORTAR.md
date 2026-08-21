# Aportar a Vibeset

Vibeset crece con lo que manda la gente. Esto explica cómo se aporta hoy y cómo
se pensó automatizar la puerta de entrada más adelante.

## Cómo se aporta hoy

Por dos puertas, y la primera no pide saber programar.

### 1. El formulario (lo normal)

Se rellena en el navegador y sale un issue con los campos ya separados:

| Qué mandas | Formulario |
| --- | --- |
| Un consejo | [Un consejo para el muro](https://github.com/Mun1to/Vibeset/issues/new?template=consejo.yml) |
| Un recurso | [Un recurso para el catálogo](https://github.com/Mun1to/Vibeset/issues/new?template=recurso.yml) |
| Una web donde se usa una técnica | [Visto en](https://github.com/Mun1to/Vibeset/issues/new?template=visto-en.yml) |

El de «visto en» es el que más falta hace: cada concepto puede nombrar una web
real donde esa técnica está corriendo, y hace falta el **marcador** que lo
demuestra (la cadena exacta que aparece en su HTML o en su CSS), porque
`pnpm enlaces` lo vuelve a comprobar cada cierto tiempo. Sin marcador, la ficha
promete una prueba que nadie puede revalidar el día que esa web se rediseñe.

### 2. La pull request (si prefieres mandarlo hecho)

Todo el catálogo vive en archivos de datos, no en una base de datos, así que
aportar también es editar un archivo y abrir una pull request:

| Qué | Archivo |
| --- | --- |
| Un consejo | `redesign/src/data/consejos.js` |
| Un recurso de frontend | `redesign/src/data/resources.js` |
| Un componente | `redesign/src/data/components.js` + su componente en `redesign/src/components/` |
| Un concepto web | `redesign/src/data/concepts.js` + su demo en `redesign/src/components/conceptDemos/` |
| Una skill | `redesign/src/data/skills.js` |

Dos reglas y ninguna más:

1. **Los dos idiomas.** Todo lo que se ve va en español y en inglés. Si no
   manejas el inglés, dilo en la pull request y se traduce antes de entrar.
2. **Quien aporta, firma.** Los consejos llevan un campo `autor` con el usuario
   de GitHub. Aparece en la tarjeta con enlace a su perfil. Lo que viene de
   fábrica va sin firma, porque es de la casa.

Las aportaciones se revisan una a una antes de entrar. Nada se publica solo.

## Quién puede aportar

Está pensado para los **Contribuidores del Discord** de Vibeset. Hoy esa
comprobación es manual: se mira el rol en el servidor antes de aprobar la pull
request. Cualquiera puede abrirla; el rol es lo que se comprueba al revisarla.

## Cómo automatizar la puerta, cuando toque

La web es estática y se sirve desde Cloudflare Pages. Por sí sola **no puede
saber quién tiene un rol en Discord**: ese dato solo lo tiene Discord. Hay tres
caminos, de menos a más trabajo.

### 1. Manual (lo que hay ahora)

Quien quiera aportar abre la pull request y el rol se comprueba a mano al
revisarla.

- **Coste:** cero. Ya funciona.
- **A favor:** control total, nada que mantener, ningún secreto que guardar.
- **En contra:** cada aportación pide una comprobación manual, y no escala si
  llegan muchas.

### 2. Bot de Discord que abre la pull request

Un Contribuidor escribe `/consejo …` en un canal del servidor. El bot comprueba
el rol (para un bot es una llamada trivial) y abre la pull request en GitHub con
la aportación ya formateada. El mantenedor sigue aprobando.

- **Qué hace falta:** una aplicación de Discord con su bot, un token de GitHub
  con permiso para abrir pull requests, y un sitio donde corra el bot (una
  Worker de Cloudflare vale, ya se paga el hosting ahí).
- **A favor:** la comprobación del rol es nativa de Discord, sin OAuth ni
  formularios. La web sigue siendo 100% estática. Da uso al servidor.
- **En contra:** hay que mantener un bot vivo y guardar dos secretos.
- **Es el camino recomendado** si algún día la puerta manual se queda corta.

### 3. Entrar con Discord desde la propia web

Un botón de «Entrar con Discord», OAuth2, y un formulario en el sitio. La
función del servidor consulta la API de Discord para ver si el usuario tiene el
rol, y si lo tiene, abre la pull request.

- **Qué hace falta:** Pages Functions en Cloudflare, `client_id` y
  `client_secret` de la aplicación de Discord, un token de bot para poder
  consultar los roles del servidor, un token de GitHub, y control de abuso.
- **A favor:** es lo más pulido para quien aporta: no sale de la web.
- **En contra:** deja de ser un sitio estático. Cuatro secretos que rotar,
  una superficie de ataque nueva y moderación que atender. Es un proyecto en sí
  mismo, no una tarde.

### Lo que no hay que hacer

- **Guardar las aportaciones en el navegador de quien las escribe.** Se pierden
  y no las ve nadie más.
- **Un formulario que mande correos.** Acaba en una bandeja que nadie mira.
- **Publicar sin revisar.** Un muro abierto sin puerta se llena de ruido en una
  semana, y el ruido se lleva por delante lo bueno que ya había.

## Estado

La sección de Consejos está **en beta**: la forma puede cambiar y los primeros
consejos son de la casa. La puerta automática está sin construir, y este
documento es el plano para cuando haga falta.
