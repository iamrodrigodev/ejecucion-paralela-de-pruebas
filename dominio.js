/** Reglas puras: no dependen del navegador ni de Playwright. */
export function crearSaludo(nombre) {
  const nombreLimpio = nombre.trim();
  return nombreLimpio ? `Hola, ${nombreLimpio}.` : 'Escribe tu nombre para recibir un saludo.';
}

export function incrementarValor(valor) {
  return valor + 1;
}
