import { createServer as crearServidor } from 'node:http';
import { readFile as leerArchivo } from 'node:fs/promises';

const archivos = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/estilos.css', ['estilos.css', 'text/css; charset=utf-8']],
  ['/aplicacion.js', ['aplicacion.js', 'text/javascript; charset=utf-8']],
  ['/dominio.js', ['dominio.js', 'text/javascript; charset=utf-8']],
  ['/vista.js', ['vista.js', 'text/javascript; charset=utf-8']]
]);
const servidor = crearServidor(async (solicitud, respuesta) => {
  const ruta = new URL(solicitud.url, 'http://localhost').pathname;
  const archivo = archivos.get(ruta);
  if (!archivo || !['GET', 'HEAD'].includes(solicitud.method)) {
    respuesta.writeHead(404); respuesta.end('No encontrado'); return;
  }
  try {
    const contenido = await leerArchivo(new URL(archivo[0], import.meta.url));
    respuesta.writeHead(200, { 'Content-Type': archivo[1], 'Cache-Control': 'no-store' });
    respuesta.end(solicitud.method === 'HEAD' ? undefined : contenido);
  } catch {
    respuesta.writeHead(500); respuesta.end('No se pudo leer el recurso.');
  }
});
servidor.listen(8002, '127.0.0.1', () => console.log('Aplicación disponible en http://127.0.0.1:8002'));
