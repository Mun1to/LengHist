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
