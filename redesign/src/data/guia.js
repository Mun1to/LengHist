// La guía de orientación: qué es esto, qué necesitas y por dónde se entra al
// catálogo. No es un curso y no se estudia: se lee de una sentada y cada bloque
// termina mandándote a la parte de Vibeset que resuelve eso.
//
// El NIVEL no esconde bloques, los marca. Esconder castiga a quien elige mal el
// nivel: se pierde cosas y ni siquiera sabe que existen. Marcando, cualquiera ve
// el camino entero y de un vistazo sabe cuál es su trozo.
//
// Los enlaces internos se escriben con `seccion` y, si hace falta, `cat`, que es
// el filtro por categoría que ya entiende cada vista (`?cat=`). Así este archivo
// no sabe nada de rutas ni de idiomas: eso lo pone el componente.

export const NIVELES = [
  {
    key: 'cero',
    es: { nombre: 'No he programado nunca', pie: 'Vas a construir algo esta semana sin entender todo lo que pasa por dentro, y está bien: eso se aprende después, construyendo.' },
    en: { nombre: 'I have never written code', pie: 'You are going to build something this week without understanding everything under the hood, and that is fine: you learn that part later, by building.' },
  },
  {
    key: 'algo',
    es: { nombre: 'He tocado algo', pie: 'Sabes moverte por archivos y has copiado código de internet. Lo que te falta no es sintaxis, es el bucle de trabajo con un agente.' },
    en: { nombre: 'I have dabbled', pie: 'You can find your way around files and you have copied code off the internet. What you are missing is not syntax, it is the working loop with an agent.' },
  },
  {
    key: 'pro',
    es: { nombre: 'Ya programo', pie: 'Lo que cambia no es el código, es tu trabajo: pasas de escribirlo a decidirlo, revisarlo y probarlo. Salta lo básico y quédate con el bucle y con dónde se rompe.' },
    en: { nombre: 'I already code', pie: 'What changes is not the code, it is your job: you go from writing it to deciding it, reviewing it and testing it. Skip the basics and stay for the loop and where it breaks.' },
  },
]

export const NIVEL_POR_DEFECTO = 'algo'

export const PASOS = [
  {
    key: 'que-es',
    para: ['cero', 'algo', 'pro'],
    es: {
      titulo: 'Qué es esto del vibe coding',
      texto: 'Construir describiendo lo que quieres, y dejar que un modelo escriba el código. Lo que **no** es: dejar de saber. Es saber otra cosa, y esa otra cosa es todo lo que viene debajo: qué pides, cómo compruebas que hace lo que dijiste, y dónde miras cuando no lo hace.',
      aviso: 'El agente nunca dice «no sé». Dice algo con mucha seguridad, y a veces está mal. Esa es la única regla que de verdad hay que interiorizar.',
      enlaces: [
        { seccion: 'consejos', cat: 'agente', texto: 'Los consejos de trabajar con un agente' },
      ],
    },
    en: {
      titulo: 'What vibe coding actually is',
      texto: 'Building by describing what you want, and letting a model write the code. What it is **not**: giving up on knowing things. It is knowing different things, and those things are everything below: what you ask for, how you check it does what you said, and where you look when it does not.',
      aviso: 'The agent never says "I do not know". It says something with total confidence, and sometimes it is wrong. That is the one rule you actually have to internalize.',
      enlaces: [
        { seccion: 'consejos', cat: 'agente', texto: 'Tips for working with an agent' },
      ],
    },
  },

  {
    key: 'kit',
    para: ['cero', 'algo'],
    es: {
      titulo: 'Lo que necesitas el primer día',
      texto: 'Un sitio donde escribir con un agente dentro, una cuenta, y una carpeta para tu proyecto. Nada más. No hace falta comprar nada para empezar, ni instalar diez cosas, ni elegir bien a la primera: cambiar de herramienta más adelante cuesta una tarde.',
      aviso: 'Elige una y quédate una semana con ella. Probar cinco el primer día es la forma más rápida de no empezar ninguna.',
      enlaces: [
        { seccion: 'resources', cat: 'agente', texto: 'Editores y agentes para escribir código' },
        { seccion: 'resources', cat: 'learn', texto: 'Dónde aprender lo que te falte' },
      ],
    },
    en: {
      titulo: 'What you need on day one',
      texto: 'Somewhere to write with an agent inside it, an account, and a folder for your project. That is all. You do not need to buy anything to start, install ten things, or pick right the first time: switching tools later costs you an afternoon.',
      aviso: 'Pick one and stay with it for a week. Trying five on day one is the fastest way to never start any of them.',
      enlaces: [
        { seccion: 'resources', cat: 'agente', texto: 'Editors and agents to write code with' },
        { seccion: 'resources', cat: 'learn', texto: 'Where to learn whatever you are missing' },
      ],
    },
  },

  {
    key: 'palabras',
    para: ['cero'],
    es: {
      titulo: 'Las palabras que todo el mundo usa sin explicártelas',
      texto: 'No son conceptos difíciles, es vocabulario. Con estas cinco entiendes casi cualquier respuesta que te dé un agente.',
      glosario: [
        { palabra: 'Repositorio', def: 'La carpeta de tu proyecto, pero con memoria: guarda cada cambio y te deja volver atrás. Se dice «repo».' },
        { palabra: 'Commit', def: 'Una foto de tu proyecto en un momento, con una frase que dice qué cambiaste. Es el punto al que puedes volver cuando algo se rompa.' },
        { palabra: 'Terminal', def: 'La ventana negra donde se escriben órdenes en vez de pulsar botones. Da miedo tres días y luego es más rápida que el ratón.' },
        { palabra: 'Dependencia', def: 'Código de otra persona que tu proyecto usa. Ahorra meses y trae los problemas de otro a tu casa.' },
        { palabra: 'Desplegar', def: 'Subir lo que has hecho a un sitio donde el resto del mundo pueda abrirlo. Hoy suele ser gratis y suele tardar un minuto.' },
      ],
      enlaces: [
        { seccion: 'consejos', cat: 'empezar', texto: 'Consejos para los primeros días' },
      ],
    },
    en: {
      titulo: 'The words everyone uses without explaining them',
      texto: 'These are not hard concepts, they are vocabulary. With these five you can follow almost any answer an agent gives you.',
      glosario: [
        { palabra: 'Repository', def: 'Your project folder, but with a memory: it saves every change and lets you go back. Everyone says "repo".' },
        { palabra: 'Commit', def: 'A snapshot of your project at one moment, with a line saying what you changed. It is the point you can return to when something breaks.' },
        { palabra: 'Terminal', def: 'The black window where you type commands instead of clicking buttons. Scary for three days, then faster than the mouse.' },
        { palabra: 'Dependency', def: 'Code written by someone else that your project uses. Saves you months and brings their problems into your house.' },
        { palabra: 'Deploy', def: 'Putting what you built somewhere the rest of the world can open it. These days it is usually free and usually takes a minute.' },
      ],
      enlaces: [
        { seccion: 'consejos', cat: 'empezar', texto: 'Tips for the first few days' },
      ],
    },
  },

  {
    key: 'pedir',
    para: ['cero', 'algo', 'pro'],
    es: {
      titulo: 'Cómo se le pide algo a un agente',
      texto: 'Un buen encargo lleva tres cosas: **qué quieres**, **con qué** se hace, y **la trampa concreta** que se salta quien no la nombra. Las dos primeras las escribe cualquiera; la tercera es la que separa un resultado que funciona de uno que parece que funciona.',
      aviso: 'Cuéntale también el porqué. Un agente que sabe para qué es algo toma mejores decisiones en los diez detalles que no le has dicho.',
      enlaces: [
        { seccion: 'concepts', texto: 'Las técnicas web, cada una con su prompt hecho' },
        { seccion: 'skills', texto: 'Skills: manuales que tu agente lee antes de trabajar' },
      ],
    },
    en: {
      titulo: 'How to ask an agent for something',
      texto: 'A good request has three parts: **what you want**, **what to build it with**, and **the specific trap** that anyone who does not name it walks into. The first two are easy; the third is what separates a result that works from one that looks like it works.',
      aviso: 'Tell it the why as well. An agent that knows what something is for makes better calls on the ten details you did not mention.',
      enlaces: [
        { seccion: 'concepts', texto: 'Web techniques, each with its prompt written out' },
        { seccion: 'skills', texto: 'Skills: manuals your agent reads before it works' },
      ],
    },
  },

  {
    key: 'bucle',
    para: ['cero', 'algo', 'pro'],
    es: {
      titulo: 'El bucle: pedir, mirar, corregir',
      texto: 'Pide una cosa pequeña, **ejecútala y mírala en la pantalla**, y solo entonces pide la siguiente. Que compile no quiere decir que haga lo que pediste, y «debería funcionar» no es «funciona». Este bucle es el trabajo entero, y quien se lo salta acaba con doscientas líneas que nadie ha visto correr.',
      aviso: 'Pide de poco en poco. Un encargo enorme te devuelve un cambio enorme que no puedes revisar, y revisarlo es tu parte del trato.',
      enlaces: [
        { seccion: 'consejos', cat: 'empezar', texto: 'Consejos de empezar' },
        { seccion: 'consejos', cat: 'oficio', texto: 'Consejos de oficio' },
      ],
    },
    en: {
      titulo: 'The loop: ask, look, fix',
      texto: 'Ask for one small thing, **run it and look at the screen**, and only then ask for the next one. Compiling does not mean it does what you asked, and "it should work" is not "it works". This loop is the whole job, and skipping it leaves you with two hundred lines nobody has ever seen run.',
      aviso: 'Ask in small pieces. A huge request gives you a huge change you cannot review, and reviewing it is your side of the deal.',
      enlaces: [
        { seccion: 'consejos', cat: 'empezar', texto: 'Getting started tips' },
        { seccion: 'consejos', cat: 'oficio', texto: 'Craft tips' },
      ],
    },
  },

  {
    key: 'rompe',
    para: ['cero', 'algo', 'pro'],
    es: {
      titulo: 'Dónde se rompe esto',
      texto: 'Los errores caros de este oficio no son de sintaxis, son de confianza. Estos cuatro se llevan casi todos los sustos: **aceptar cambios sin leerlos**, **dejar una clave escrita dentro del código**, **arrastrar dependencias que nadie ha mirado** y **no versionar**, que es trabajar sin red y sin manera de volver atrás.',
      aviso: 'Una clave que llega a un repositorio público se da por robada aunque la borres al minuto: queda en el historial y hay robots buscándolas. Se cambia, no se esconde.',
      enlaces: [
        { seccion: 'consejos', cat: 'git', texto: 'Consejos de Git y control de versiones' },
        { seccion: 'resources', cat: 'comprobar', texto: 'Qué revisar antes de publicar' },
      ],
    },
    en: {
      titulo: 'Where this breaks',
      texto: 'The expensive mistakes here are not about syntax, they are about trust. These four cause almost every disaster: **accepting changes without reading them**, **leaving a key written inside the code**, **pulling in dependencies nobody has looked at**, and **not using version control**, which is working without a net and no way back.',
      aviso: 'A key that reaches a public repository is stolen even if you delete it a minute later: it stays in the history and there are bots hunting for them. You rotate it, you do not hide it.',
      enlaces: [
        { seccion: 'consejos', cat: 'git', texto: 'Git and version control tips' },
        { seccion: 'resources', cat: 'comprobar', texto: 'What to check before you ship' },
      ],
    },
  },

  {
    key: 'lenguaje',
    para: ['cero', 'algo'],
    // El test de lenguajes se pinta aqui dentro, que es el unico sitio donde su
    // respuesta significa algo. Va en la raiz y no dentro de cada idioma: es
    // una pieza de la pagina, no un texto.
    test: true,
    es: {
      titulo: 'Con qué lo escribes',
      texto: 'Con un agente delante, el lenguaje pesa menos de lo que pesaba: no vas a escribir la mayor parte tú. Pero sigue decidiendo dónde corre lo que hagas, qué librerías tienes a mano y con quién puedes pedir ayuda cuando te atasques.',
      enlaces: [
        { seccion: 'languages', texto: 'Los cien lenguajes, con ficha comparable' },
      ],
    },
    en: {
      titulo: 'What you write it in',
      texto: 'With an agent in front of you the language matters less than it used to: you are not going to type most of it. But it still decides where your thing runs, which libraries you have at hand, and who can help you when you get stuck.',
      enlaces: [
        { seccion: 'languages', texto: 'A hundred languages, with comparable profiles' },
      ],
    },
  },

  {
    key: 'lejos',
    para: ['algo', 'pro'],
    es: {
      titulo: 'Cuando quieras que se note',
      texto: 'Lo de arriba te deja construyendo. Lo de aquí es lo que separa una web que funciona de una que además apetece usar: técnicas que sabes pedir, piezas que puedes copiar, y manuales que tu agente lee para hacerlo bien sin que se lo expliques cada vez.',
      enlaces: [
        { seccion: 'concepts', texto: 'Técnicas de diseño web, con demo y prompt' },
        { seccion: 'components', texto: 'Componentes vivos que puedes copiar' },
        { seccion: 'skills', texto: 'Skills para tu agente' },
      ],
    },
    en: {
      titulo: 'When you want it to show',
      texto: 'Everything above gets you building. This part is what separates a site that works from one you actually enjoy using: techniques you know how to ask for, pieces you can copy, and manuals your agent reads so it gets it right without you explaining every time.',
      enlaces: [
        { seccion: 'concepts', texto: 'Web design techniques, with demo and prompt' },
        { seccion: 'components', texto: 'Live components you can copy' },
        { seccion: 'skills', texto: 'Skills for your agent' },
      ],
    },
  },
]
