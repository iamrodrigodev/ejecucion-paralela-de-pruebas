import { crearSaludo, incrementarValor } from './dominio.js';
import { VistaDemostracion } from './vista.js';

const obtenerElemento = identificador => document.getElementById(identificador);
const vista = new VistaDemostracion({
  formulario: obtenerElemento('formulario'), nombre: obtenerElemento('nombre'),
  saludo: obtenerElemento('saludo'), contador: obtenerElemento('contador'),
  incrementar: obtenerElemento('incrementar')
});
let contador = 0;
vista.alEnviarNombre(nombre => vista.mostrarSaludo(crearSaludo(nombre)));
vista.alIncrementar(() => {
  contador = incrementarValor(contador);
  vista.mostrarContador(contador);
});
