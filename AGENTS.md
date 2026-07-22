# AGENTS.md — Reglas de IA para Lenghist

> Este archivo define las instrucciones y directivas obligatorias para cualquier modelo de IA (Gemini, Claude, Cursor, etc.) en el proyecto **Lenghist**.

## Directivas Obligatorias Multi-Proyecto

1. **Lectura y Registro Obligatorio en `FEEDBACK.md`**:
   - Antes de iniciar cualquier tarea en un proyecto, DEBES leer su archivo `FEEDBACK.md` para aprender de su historial y no repetir errores pasados.
   - Cada vez que nos enfrentemos a un obstáculo técnico, error de compilación o sesión de depuración prolongada ("batallando con un bug o un fail"), DEBES registrar automáticamente el problema, la causa raíz y la solución exacta dentro del `FEEDBACK.md` del proyecto correspondiente.

2. **Implementación Exhaustiva y Global**:
   - Toda funcionalidad, cambio visual o internacionalización (i18n) DEBE implementarse de forma global en toda la aplicación. Prohibido dejar textos hardcodeados o componentes a medias.

3. **Reflexión Profunda y Verificación Multi-Paso**:
   - Antes de presentarme un trabajo, realiza una auditoría interna de 2 a 3 pasadas comprobando casos de borde, temas (Claro/Oscuro) e idiomas.

4. **Planes de Implementación Proactivos**:
   - Ante solicitudes complejas o ambigüedades, prepara un plan estructurado con pasos claros y solicita confirmación antes de modificar código.

## Munir dicta por voz (regla común — ver ../Reglas_de_los_proyectos.md)
Munir a menudo escribe sus prompts **dictando con VoCript (voz→texto)**, que **no siempre transcribe exacto**: puede haber palabras mal puestas, nombres mal escritos o frases raras. **Interpreta la intención real, no lo literal**; si algo no cuadra o parece error de dictado, **pregunta antes de actuar**. Sé humilde y flexible.

## Reglas comunes (jun-2026 — ver ../Reglas_de_los_proyectos.md)
- **Entender antes de arreglar.** Ante un error no toques código a ciegas: entiende la estructura, reproduce y aísla la **causa raíz** (no el síntoma), explícame diagnóstico y plan, y aplica el arreglo **más pequeño y seguro**. Si no lo entiendes, léelo o pregunta antes.
- **Ciberseguridad como requisito.** Nunca expongas secretos (API keys, tokens, credenciales) en código, logs, commits ni `.md` → van en `.env`/variables de entorno fuera de git. Sanea toda entrada externa (SQLi, XSS, **prompt injection**), mínimo privilegio, dependencias al día. Ante la duda, opción segura.
- **Cerrar explicando.** Al acabar una tarea con entidad, resume en 3 partes: (1) qué he hecho en simple; (2) cómo lo he hecho y qué aprender; (3) 2-3 preguntas de seguimiento. (En microtareas no hace falta.)
- **README y commits en inglés; docs internos en español.** El `README.md`, la descripción de GitHub y los mensajes de commit van en inglés. Todo lo interno (AGENTS.md, docs/, HANDOFF.md…) siempre en español. Excepción: Orquio (mercado local español).
- **Lluvia de ideas + preguntas críticas.** Ante decisiones con entidad (nueva feature, arquitectura, herramienta clave…): propón 2-3 alternativas con pros/contras, lanza 2-4 preguntas críticas antes de implementar, y espera respuesta. En microdecisiones no hace falta.
- **Frescura de memoria (cada 3 prompts).** Cada 3 prompts, releo `HANDOFF.md`/`FEEDBACK.md`/`docs/` del proyecto activo y la memoria global (`MEMORY.md`). Evita contexto desactualizado en sesiones largas o con varios agentes tocando los mismos archivos. (Relectura best-effort; garantía exacta requeriría un hook.)
- **Gestor de paquetes: siempre pnpm.** En proyectos Node/JS, usa `pnpm`, nunca `npm`/`yarn`. Si aparece `package-lock.json` o `yarn.lock`, bórralo y corre `pnpm install`. Fija `"packageManager"` en `package.json`.
- **Guion normal, no raya (solo en lo público).** En repos públicos, README, commits y webs/UI de cara al usuario, usa `-` o `/` en vez de `—`/`–` (delata texto de IA). En AGENTS.md/docs internos no hace falta tocarlo.
- **Trato: «Munito» o «socio».** Al dirigirte a Munir en el chat, llámale «Munito» o «socio» (tono cercano, de equipo). Aplica en todas las sesiones.
- **Confirmar la intención antes de ejecutar (regla I, jul-2026).** Antes de una tarea con entidad: di qué has entendido y qué asumes; si hay varias interpretaciones, preséntalas y pregunta en vez de elegir en silencio; pregunta hasta estar seguro de verdad y solo entonces empieza (cada pregunta a tiempo ahorra errores y tokens). En microtareas no hace falta.
- **Simplicidad primero, cambios quirúrgicos (regla J, jul-2026).** Código mínimo que resuelva el problema: nada especulativo ni features no pedidas; toca solo lo que la tarea pide, sin "mejorar" código adyacente ni refactorizar lo que no está roto; limpia solo los huérfanos que tus cambios crearon. Nada está terminado sin verificarlo contra el objetivo.
- **Arranque estructurado, primero el plano (regla K, jul-2026).** Antes de programar un proyecto nuevo (o de ordenar uno a medias): investiga el stack en vez de copiarlo por inercia (2-3 opciones con pros/contras), encuadra con preguntas, decide herramientas con criterio, monta los cimientos (`AGENTS.md` + `README` + `docs/METAS.md` + carpetas) y deja el mapa a la vista (qué es, con qué, cómo, metas por orden con la próxima acción). No toques código hasta que el plano esté claro.
- **Cerrar en una frase (regla L, jul-2026).** Al terminar algo con entidad: primera línea = una frase de lo hecho, sin muletillas ("bueno", "básicamente"); debajo los pasos siguientes (1-3); el detalle largo solo después y si aporta. Refina la regla C (que queda para cuando haya algo que enseñar).
- **Saber el día y la hora reales (regla N, jul-2026).** No asumas la fecha ni la hora: consúltalas (`Get-Date`) cuando importen, que es más a menudo de lo que parece. Obligatorio al fechar algo que se escribe en un documento, en memoria o en un commit; al triar notas dictadas que traen hora; y **antes de dar por buena cualquier convocatoria, plazo o ventana externa** (si algo dice "anual" o "ver web", comprueba si ya pasó).
- **Ambición por defecto (regla O, jul-2026).** La meta de Munir no se negocia: se critica el **riesgo concreto y la secuencia**, nunca su capacidad ("esto no funciona todavía porque no tienes distribución" sí; "esto es demasiado para ti" no). Todo lo que se aparque sale con su **condición de desbloqueo** ("todavía no, y esto es lo que lo abre"), nunca un "no" seco. Nada de proyectar plazos de meses como si fueran un techo. Y cuando algo sea bueno, decirlo primero y sin peros.

## froede (edición visual de webs)

Munir edita las webs de sus proyectos en localhost con **froede** (`C:\proyectos\froede`): extensión de navegador + companion local que escriben los cambios DIRECTAMENTE en los archivos fuente. Si aparecen diffs sin commit con `style={{ ... }}` inline nuevos, atributos `style="..."`/`href`/`alt`/`title` cambiados o textos editados, seguramente son ediciones intencionales de Munir hechas con froede: acéptalas y consérvalas, NO las reviertas ni las "normalices" (p. ej. moverlas a clases CSS) salvo que él lo pida. Notas: `data-froede-loc` solo existe en el DOM en dev (nunca llega a los archivos); `.froede-token` es un secreto local que debe estar en `.gitignore` y jamás commitearse. Regla completa: `C:\proyectos\Reglas_de_los_proyectos.md` (regla M).
