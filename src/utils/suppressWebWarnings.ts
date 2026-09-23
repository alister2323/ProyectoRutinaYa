// React Native Web todavía muestra algunos avisos internos de compatibilidad.
// Este archivo se carga antes que App para ocultar solo esos avisos conocidos.
const ignoredWebMessages = [
  'props.pointerEvents is deprecated',
  'shadow* style props are deprecated',
  'Cannot find single active touch',
];

const originalWarn = console.warn;
const originalError = console.error;

// Comprueba solo el primer texto del mensaje y deja pasar otros errores.
const isIgnoredWebMessage = (args: unknown[]) => (
  typeof args[0] === 'string'
  && ignoredWebMessages.some((message) => (args[0] as string).includes(message))
);

console.warn = (...args: unknown[]) => {
  if (isIgnoredWebMessage(args)) return;
  originalWarn(...(args as Parameters<typeof console.warn>));
};

console.error = (...args: unknown[]) => {
  if (isIgnoredWebMessage(args)) return;
  originalError(...(args as Parameters<typeof console.error>));
};
