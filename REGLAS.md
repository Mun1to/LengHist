# Reglas y Directrices de Lenghist

> Este archivo define las reglas de desarrollo, negocio y seguridad del proyecto. Debe ser leído por cualquier desarrollador o IA antes de realizar cambios.

## 1. Reglas de Git y Flujo de Trabajo
*   **Mensajes de Commit:** Nunca incluyas firmas automáticas como `Co-Authored-By`. Los cambios deben estructurarse de forma clara y óptima.
*   **Control de Push:** Está prohibido hacer `git push` a GitHub sin la autorización explícita de Munir.
*   **Colaboración:** Explica los cambios desde el "por qué" antes del "cómo", utilizando analogías y tablas cuando sea necesario.

## 2. Seguridad, APIs y Protección DDoS (Crítico)
*   **Gestor de Paquetes:** Si se utiliza algún script o paquete local, usar estrictamente `pnpm` (nunca `npm` ni `yarn`) para mitigar riesgos de seguridad.
*   **API Keys y Credenciales:** Nunca guardes ni subas claves de API u otros datos sensibles en el repositorio. Usa un archivo `.env` local si se implementan llamadas externas.
*   **Límites de Uso y Protección DDoS:** Si en el futuro se conectan APIs o servicios que carguen datos externos dinámicos, se deben implementar límites de uso por IP o tasa de peticiones (Rate Limiting). Utiliza tecnologías de mitigación y protección contra DDoS como Cloudflare o similares para evitar abusos.

## 3. Cuantificación y Validación (Reglas de Coste)
Antes de avanzar a desarrollo técnico:
1. **Validación:** ¿Qué problema real del cliente estamos resolviendo? ¿Cómo se va a validar?
2. **Coste:** Cuantificar el coste estimado de APIs, hosting, infraestructura e IA.
3. **MVP:** Entregar primero un producto mínimo funcional para captar feedback antes de escalar o invertir más.
4. **Feedback:** Coger de cada cliente un feedback de el producto.
5. **Escalabilidad:** De ese feedback inicial recopilar información y formular la escalabilidad e inversión.

## 4. Estructuración, Simplicidad y UX Predictivo
*   **Simplicidad por Diseño:** Mantener la interfaz limpia, minimalista y libre de elementos innecesarios. Evitar la sobrecomplicación visual o del código.
*   **Estructura Predictiva y Simetría:** El diseño debe ser intuitivo y predecible. Colocar los elementos de navegación, menús, acciones principales y botones en ubicaciones convencionales (patrones de diseño UX estándar). Buscar preferiblemente la simetría y el equilibrio visual en la distribución de bloques para transmitir orden y facilitar el escaneo visual de la pantalla.
*   **Profundidad y Detalle en el Diseño:** Ir más allá de diseños planos o genéricos. Cuidar los detalles visuales de forma profunda: uso consistente de márgenes/paddings, tipografía con jerarquías claras, y aplicar sutiles efectos de profundidad (elevaciones, sombras suaves, transparencias o microinteracciones) que hagan que la interfaz se sienta de alta calidad y profesional.
*   **Navegación y Orientación:** Debe ser extremadamente fácil orientarse dentro de cualquier web o programa. Utilizar jerarquías visuales claras (títulos estructurados, espaciados consistentes, indicadores de estado activo) para que el usuario siempre sepa en qué sección se encuentra y cómo realizar acciones comunes.

## 5. Directrices Técnicas Específicas
*   **Filosofía No-Build:** Todo debe funcionar abriendo directamente el archivo `index.html` en el navegador (100% estático).
*   **Uso de Frameworks y Build steps:** No usar frameworks pesados (React, Vue, etc.) ni configuraciones complejas de build (Vite, Webpack, etc.). 
*   **Instalación de Librerías y Scripts:** Sí se permite integrar librerías externas o scripts adicionales (de diseño, iconos, efectos visuales o utilidades) para hacer el código más claro, legible u óptimo, siempre que puedan cargarse de forma directa en el navegador (por ejemplo, mediante CDN o archivos locales estáticos) sin requerir un paso de compilación/transpilación obligatorio.

## 6. Directivas Obligatorias Multi-Proyecto (IA)
1. **Lectura y Registro Obligatorio en `FEEDBACK.md`**: Antes de iniciar cualquier tarea, leer `FEEDBACK.md`. Registrar automáticamente en `FEEDBACK.md` cualquier obstáculo técnico, error de compilación o sesión de depuración prolongada.
2. **Implementación Exhaustiva y Global**: Toda funcionalidad o cambio DEBE implementarse de forma global en toda la aplicación (sin hardcodeo ni componentes a medias).
3. **Reflexión Profunda y Verificación Multi-Paso**: Realizar auditoría interna de 2-3 pasadas (casos límite, temas claro/oscuro, idiomas) antes de presentar el trabajo.
4. **Planes de Implementación Proactivos**: Ante solicitudes complejas o ambigüedades, preparar plan estructurado y solicitar confirmación previa.

## 7. Definición de Terminado (DoD)
Antes de considerar una tarea finalizada, se debe:
- Proporcionar un enlace de previsualización (localhost, captura o archivo generado).
- Preguntar explícitamente: *¿Te ha gustado cómo ha quedado?*
