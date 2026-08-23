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
      texto: 'No son conceptos difíciles, es vocabulario. Con estas entiendes casi cualquier respuesta que te dé un agente.',
      glosario: [
        { palabra: 'Repositorio', def: 'La carpeta de tu proyecto, pero con memoria: guarda cada cambio y te deja volver atrás. Se dice «repo».' },
        { palabra: 'Commit', def: 'Una foto de tu proyecto en un momento, con una frase que dice qué cambiaste. Es el punto al que puedes volver cuando algo se rompa.' },
        { palabra: 'Terminal', def: 'La ventana negra donde se escriben órdenes en vez de pulsar botones. Da miedo tres días y luego es más rápida que el ratón.' },
        { palabra: 'Dependencia', def: 'Código de otra persona que tu proyecto usa. Ahorra meses y trae los problemas de otro a tu casa.' },
        { palabra: 'Desplegar', def: 'Subir lo que has hecho a un sitio donde el resto del mundo pueda abrirlo. Hoy suele ser gratis y suele tardar un minuto.' },
        { palabra: 'Rama', def: 'Una línea de trabajo aparte, para tocar sin romper lo que ya funciona. Cuando sale bien, se junta con la principal.' },
        { palabra: 'Framework', def: 'Un esqueleto ya montado sobre el que construyes, con las decisiones aburridas tomadas. Te ahorra semanas y te ata a su forma de hacer las cosas.' },
        { palabra: 'API', def: 'La puerta por la que un programa habla con otro. Cuando algo «se conecta con» otra cosa, casi siempre es por aquí.' },
        { palabra: 'Local y producción', def: 'Local es tu ordenador, donde puedes romper. Producción es donde lo ve la gente. Que funcione en el primero no garantiza nada del segundo.' },
      ],
      enlaces: [
        { seccion: 'consejos', cat: 'empezar', texto: 'Consejos para los primeros días' },
      ],
    },
    en: {
      titulo: 'The words everyone uses without explaining them',
      texto: 'These are not hard concepts, they are vocabulary. With these you can follow almost any answer an agent gives you.',
      glosario: [
        { palabra: 'Repository', def: 'Your project folder, but with a memory: it saves every change and lets you go back. Everyone says "repo".' },
        { palabra: 'Commit', def: 'A snapshot of your project at one moment, with a line saying what you changed. It is the point you can return to when something breaks.' },
        { palabra: 'Terminal', def: 'The black window where you type commands instead of clicking buttons. Scary for three days, then faster than the mouse.' },
        { palabra: 'Dependency', def: 'Code written by someone else that your project uses. Saves you months and brings their problems into your house.' },
        { palabra: 'Deploy', def: 'Putting what you built somewhere the rest of the world can open it. These days it is usually free and usually takes a minute.' },
        { palabra: 'Branch', def: 'A separate line of work, so you can change things without breaking what already works. When it goes well, you merge it back.' },
        { palabra: 'Framework', def: 'A ready-made skeleton you build on, with the boring decisions already made. It saves you weeks and ties you to its way of doing things.' },
        { palabra: 'API', def: 'The door one program uses to talk to another. When something "connects to" something else, this is almost always how.' },
        { palabra: 'Local and production', def: 'Local is your machine, where you can break things. Production is where people see it. Working on the first guarantees nothing about the second.' },
      ],
      enlaces: [
        { seccion: 'consejos', cat: 'empezar', texto: 'Tips for the first few days' },
      ],
    },
  },

  {
    key: 'vocabulario-agentes',
    para: ['cero', 'algo', 'pro'],
    es: {
      titulo: 'El vocabulario de los agentes',
      texto: 'Este oficio tiene tres años y ya tiene su jerga. No la sabe nadie por haber programado mucho antes, así que aquí va entera y sin misterio.',
      glosario: [
        { palabra: 'Modelo', def: 'El motor que escribe el texto. Por sí solo no recuerda la conversación de ayer ni puede tocar tus archivos: solo genera lo siguiente que va detrás de lo que ya hay.' },
        { palabra: 'Cliente', def: 'El programa con el que tú hablas: una app de chat, una extensión de tu editor, una ventana de terminal. Pone la interfaz y guarda la conversación.' },
        { palabra: 'Harness', def: 'La capa que envuelve al modelo y le da manos: le ofrece las herramientas, ejecuta lo que pide, le devuelve el resultado y decide cuándo parar. Es lo que convierte un modelo que solo escribe en un agente que trabaja.' },
        { palabra: 'Agente', def: 'Modelo más harness más herramientas, dando vueltas en bucle hasta terminar el encargo. La palabra no describe una tecnología, describe ese montaje.' },
        { palabra: 'Herramienta', def: 'Cada cosa concreta que el harness le deja hacer: leer un archivo, ejecutar un comando, buscar en la web. El modelo pide, el harness ejecuta y le cuenta cómo ha ido.' },
        { palabra: 'Contexto', def: 'Todo lo que tiene delante ahora mismo: tus mensajes, los archivos que ha leído y lo que le han devuelto los comandos. Fuera de ahí, para él no existe.' },
        { palabra: 'Ventana de contexto', def: 'Cuánto cabe en ese «delante». Cuando se llena, lo viejo se resume o se cae, y por eso una conversación larguísima empieza a olvidar cosas que le dijiste al principio.' },
        { palabra: 'Token', def: 'La unidad en que se parte el texto para contarlo y cobrarlo. Ni letras ni palabras: trozos de palabra. Es la moneda de todo esto.' },
        { palabra: 'Prompt de sistema', def: 'Las instrucciones fijas que el modelo recibe antes que tú, y que tú no ves. Marcan cómo se comporta por defecto.' },
        { palabra: 'MCP', def: 'Un estándar para enchufarle herramientas de fuera (tu base de datos, tu gestor de tareas, un navegador) sin esperar a que tu cliente las traiga de fábrica.' },
        { palabra: 'Skill', def: 'Un manual que el agente lee cuando toca ese tema, en vez de que se lo expliques otra vez. Aquí hay una sección entera de ellas.' },
        { palabra: 'Alucinación', def: 'Cuando se inventa algo con total seguridad: una función que no existe, un dato que no ha comprobado. No es una avería rara, es un efecto de cómo funciona, y por eso se comprueba todo.' },
      ],
      enlaces: [
        { seccion: 'skills', texto: 'Las skills del catálogo' },
        { seccion: 'resources', cat: 'agente', texto: 'Editores y agentes' },
      ],
    },
    en: {
      titulo: 'The vocabulary of agents',
      texto: 'This craft is three years old and already has its own jargon. Nobody knows it from having programmed a lot before, so here it is in full and with no mystery.',
      glosario: [
        { palabra: 'Model', def: 'The engine that writes the text. On its own it does not remember yesterday\'s conversation and cannot touch your files: it only generates what comes next after what is already there.' },
        { palabra: 'Client', def: 'The program you actually talk to: a chat app, an editor extension, a terminal window. It provides the interface and keeps the conversation.' },
        { palabra: 'Harness', def: 'The layer that wraps the model and gives it hands: it offers the tools, runs what the model asks for, hands back the result and decides when to stop. It is what turns a model that only writes into an agent that works.' },
        { palabra: 'Agent', def: 'Model plus harness plus tools, looping until the job is done. The word does not describe a technology, it describes that assembly.' },
        { palabra: 'Tool', def: 'Each concrete thing the harness lets it do: read a file, run a command, search the web. The model asks, the harness runs it and reports back.' },
        { palabra: 'Context', def: 'Everything it has in front of it right now: your messages, the files it has read, and what the commands returned. Outside of that, as far as it is concerned, nothing exists.' },
        { palabra: 'Context window', def: 'How much fits in that "in front of it". When it fills up, the old stuff gets summarized or falls off, which is why a very long conversation starts forgetting things you said at the beginning.' },
        { palabra: 'Token', def: 'The unit text is cut into so it can be counted and billed. Not letters, not words: pieces of words. It is the currency of all this.' },
        { palabra: 'System prompt', def: 'The fixed instructions the model gets before you, and that you never see. They set how it behaves by default.' },
        { palabra: 'MCP', def: 'A standard for plugging in outside tools (your database, your task tracker, a browser) without waiting for your client to ship them.' },
        { palabra: 'Skill', def: 'A manual the agent reads when that topic comes up, instead of you explaining it again. There is a whole section of them here.' },
        { palabra: 'Hallucination', def: 'When it invents something with total confidence: a function that does not exist, a fact it never checked. It is not a rare breakdown, it is a side effect of how it works, and it is why you check everything.' },
      ],
      enlaces: [
        { seccion: 'skills', texto: 'The skills in the catalog' },
        { seccion: 'resources', cat: 'agente', texto: 'Editors and agents' },
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
    key: 'reglas',
    para: ['cero', 'algo', 'pro'],
    es: {
      titulo: 'Tus reglas y tu estructura, escritas una vez',
      texto: 'Un agente empieza **cada conversación desde cero**: no se acuerda de lo que decidisteis ayer. Si le explicas en cada chat cómo quieres las cosas, pagas ese peaje todos los días y el resultado cambia según el día. Se arregla escribiéndolo **una sola vez** en un archivo en la raíz del proyecto, que el agente lee solo antes de trabajar: `AGENTS.md` es el nombre estándar y ya lo leen casi todas las herramientas.',
      texto2: 'La estructura hace lo mismo sin que la escribas: un agente decide dónde va un archivo nuevo mirando dónde están los demás. En un proyecto ordenado acierta; en uno desordenado desordena más, y cada encargo lo empeora un poco.',
      aviso: 'Reglas cortas y comprobables. «Los textos van en `src/i18n`, nunca dentro del componente» sirve; «escribe código de calidad» no dice nada. Y cuando tengas que corregir lo mismo dos veces, esa corrección ya es una regla: escríbela ahí en vez de volver a decirla.',
      enlaces: [
        { seccion: 'skills', texto: 'Skills: reglas empaquetadas que tu agente lee solo' },
        { seccion: 'consejos', cat: 'agente', texto: 'Consejos de trabajo con un agente' },
      ],
    },
    en: {
      titulo: 'Your rules and your structure, written down once',
      texto: 'An agent starts **every conversation from scratch**: it does not remember what you two decided yesterday. If you explain how you like things in every chat, you pay that toll daily and the result changes from day to day. You fix it by writing it **once** in a file at the root of the project that the agent reads before it works: `AGENTS.md` is the standard name and nearly every tool reads it already.',
      texto2: 'Structure does the same job without you writing anything: an agent decides where a new file goes by looking at where the others are. In a tidy project it gets it right; in a messy one it adds to the mess, and every request makes it slightly worse.',
      aviso: 'Short, checkable rules. "Copy lives in `src/i18n`, never inside the component" works; "write quality code" says nothing. And when you have to correct the same thing twice, that correction is already a rule: write it down instead of saying it again.',
      enlaces: [
        { seccion: 'skills', texto: 'Skills: packaged rules your agent reads on its own' },
        { seccion: 'consejos', cat: 'agente', texto: 'Tips for working with an agent' },
      ],
    },
  },

  {
    key: 'bucle',
    para: ['cero', 'algo', 'pro'],
    es: {
      titulo: 'El bucle: pedir, mirar, corregir',
      texto: 'Pide una cosa pequeña, **ejecútala y mírala en la pantalla**, y solo entonces pide la siguiente. Que compile no quiere decir que haga lo que pediste, y «debería funcionar» no es «funciona». Este bucle es el trabajo entero, y quien se lo salta acaba con doscientas líneas que nadie ha visto correr.',
      lista: [
        '**Un cambio cada vez, y probado antes de pedir el siguiente.** Es más lento en la primera hora y más rápido el resto del día, porque cuando algo se rompe sabes exactamente qué lo rompió.',
        '**Guarda antes de pedir algo grande.** Un commit es tu botón de deshacer: sin él, «vuelve a como estaba» es una conversación en vez de un comando.',
        '**Dile qué no tocar.** Sin fronteras, un agente reescribe media pantalla para arreglar un botón.',
        '**Lee lo que ha cambiado antes de aceptarlo.** Si es tan grande que no puedes leerlo, el problema fue el encargo, no el cambio.',
        '**Si algo falla dos veces igual, deja de ajustar detalles.** A la tercera el problema ya no es tu línea de código: es el enfoque, la librería o la herramienta. Cambia de camino, no de decimal.',
        '**Lo que tengas que corregir dos veces, escríbelo en tus reglas.** Lo que hagas a mano tres veces, automatízalo.',
      ],
      aviso: 'Pide de poco en poco. Un encargo enorme te devuelve un cambio enorme que no puedes revisar, y revisarlo es tu parte del trato.',
      enlaces: [
        { seccion: 'consejos', cat: 'empezar', texto: 'Consejos de empezar' },
        { seccion: 'consejos', cat: 'oficio', texto: 'Consejos de oficio' },
      ],
    },
    en: {
      titulo: 'The loop: ask, look, fix',
      texto: 'Ask for one small thing, **run it and look at the screen**, and only then ask for the next one. Compiling does not mean it does what you asked, and "it should work" is not "it works". This loop is the whole job, and skipping it leaves you with two hundred lines nobody has ever seen run.',
      lista: [
        '**One change at a time, tested before you ask for the next.** Slower for the first hour and faster for the rest of the day, because when something breaks you know exactly what broke it.',
        '**Save before asking for anything big.** A commit is your undo button: without it, "put it back how it was" is a conversation instead of a command.',
        '**Tell it what not to touch.** With no fences, an agent rewrites half the screen to fix one button.',
        '**Read what changed before you accept it.** If it is too big to read, the problem was the request, not the change.',
        '**If something fails the same way twice, stop tweaking details.** By the third try the problem is not your line of code: it is the approach, the library or the tool. Change roads, not decimals.',
        '**Whatever you have to correct twice, write into your rules.** Whatever you do by hand three times, automate.',
      ],
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
