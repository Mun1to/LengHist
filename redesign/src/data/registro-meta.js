// Campos de la casa que FrontLaxWeb necesita para elegir una pieza, apartados aquí
// para no ensuciar components.js, que alimenta la UI y las demos. Se cruzan por
// `key` con COMPONENT_ITEMS.
//
// - arquetipos: en qué casillas de la matriz de FrontLaxWeb encaja la pieza.
//   Vocabulario: 'marca-creativa', 'portfolio', 'lanzamiento', 'saas', 'fintech',
//   'ecommerce', 'editorial', 'evento'.
// - costeMovimiento: cuánto pesa y cuánto se mueve. 'alto' | 'medio' | 'bajo'.
// - cumpleDial: true si el movimiento respeta la política de la casa (se puede
//   graduar con --motion-gain, o lo dirige el usuario, que no se escala). false si
//   es movimiento decorativo de gran amplitud que hoy no trae el dial: esa es la
//   señal para que FrontLaxWeb no lo meta en un SaaS ni en un fintech.
// - a11y: nota de accesibilidad. 'ok' | 'decorativo' | 'requiere-refuerzo'.
//
// Solo los 12 componentes llevan overlay. Las skills no son piezas de movimiento,
// así que no tienen entrada y el código trata su ausencia como «sin restricción».
export const META_CASA = {
  bubble: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento'], costeMovimiento: 'alto', cumpleDial: false, a11y: 'decorativo' },
  cloth: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento'], costeMovimiento: 'alto', cumpleDial: false, a11y: 'decorativo' },
  dithered: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento'], costeMovimiento: 'alto', cumpleDial: false, a11y: 'decorativo' },
  asciify: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento'], costeMovimiento: 'alto', cumpleDial: false, a11y: 'decorativo' },
  peel: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento'], costeMovimiento: 'alto', cumpleDial: false, a11y: 'decorativo' },
  bend: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento'], costeMovimiento: 'alto', cumpleDial: false, a11y: 'decorativo' },
  asciiObject: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento'], costeMovimiento: 'alto', cumpleDial: false, a11y: 'decorativo' },
  laser: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento'], costeMovimiento: 'alto', cumpleDial: false, a11y: 'decorativo' },
  particleScroll: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento'], costeMovimiento: 'alto', cumpleDial: false, a11y: 'decorativo' },
  chromaGlow: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento', 'editorial'], costeMovimiento: 'medio', cumpleDial: false, a11y: 'decorativo' },
  emboss: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento', 'editorial'], costeMovimiento: 'medio', cumpleDial: false, a11y: 'decorativo' },
  // El único que no es WebGL decorativo: botones en CSS puro, movimiento solo al
  // pasar el cursor (dirigido por el usuario, la política del dial no lo escala).
  // Por eso entra en arquetipos sobrios donde los demás chocan.
  colorDepth: { arquetipos: ['saas', 'fintech', 'ecommerce', 'marca-creativa', 'portfolio', 'editorial'], costeMovimiento: 'bajo', cumpleDial: true, a11y: 'ok' },
}
