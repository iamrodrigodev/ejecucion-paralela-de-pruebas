/** Adaptador de presentación: recibe los elementos que utiliza. */
export class VistaDemostracion {
  constructor(elementos) { this.elementos = elementos; }

  alEnviarNombre(accion) {
    this.elementos.formulario.addEventListener('submit', evento => {
      evento.preventDefault();
      accion(this.elementos.nombre.value);
    });
  }

  alIncrementar(accion) { this.elementos.incrementar.addEventListener('click', accion); }
  mostrarSaludo(saludo) { this.elementos.saludo.textContent = saludo; }
  mostrarContador(valor) { this.elementos.contador.textContent = String(valor); }
}
