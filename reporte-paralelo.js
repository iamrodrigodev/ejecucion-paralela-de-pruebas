import { mkdirSync as crearCarpeta, writeFileSync as guardarArchivo } from 'node:fs';

/** Adaptador de evidencia: registra resultados reales de Playwright. */
export default class ReporteParalelo {
  constructor() { this.registros = []; }

  onBegin(configuracion) { this.workersConfigurados = configuracion.workers; }

  onTestEnd(prueba, resultado) {
    this.registros.push({
      prueba: prueba.title,
      worker: resultado.workerIndex,
      inicio: resultado.startTime.getTime(),
      fin: resultado.startTime.getTime() + resultado.duration,
      duracionMs: resultado.duration,
      estado: resultado.status
    });
  }

  onEnd(resultado) {
    if (!this.registros.length) return;
    const coincidencias = [];
    for (let primero = 0; primero < this.registros.length; primero++) {
      for (let segundo = primero + 1; segundo < this.registros.length; segundo++) {
        const anterior = this.registros[primero];
        const siguiente = this.registros[segundo];
        const solapamientoMs = Math.min(anterior.fin, siguiente.fin) - Math.max(anterior.inicio, siguiente.inicio);
        if (anterior.worker !== siguiente.worker && solapamientoMs > 0) {
          coincidencias.push({ pruebas: [anterior.prueba, siguiente.prueba], solapamientoMs });
        }
      }
    }
    const evidencia = {
      estado: resultado.status,
      workersConfigurados: this.workersConfigurados,
      workersUtilizados: [...new Set(this.registros.map(registro => registro.worker))],
      paralelismoObservado: coincidencias.length > 0,
      intervalos: this.registros,
      coincidencias
    };
    crearCarpeta('evidencias', { recursive: true });
    guardarArchivo('evidencias/ejecucion.json', JSON.stringify(evidencia, null, 2) + '\n');
    guardarArchivo('evidencias/resumen.html', crearResumen(evidencia));
    console.log(`\nEvidencia real: ${evidencia.workersUtilizados.length} workers utilizados; solapamiento observado: ${evidencia.paralelismoObservado ? 'sí' : 'no'}.`);
  }
}

function escaparTexto(texto) {
  return String(texto).replace(/[&<>"']/g, caracter => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[caracter]));
}

function crearResumen(evidencia) {
  const filas = evidencia.intervalos.map(registro => `<tr><td>${escaparTexto(registro.prueba)}</td><td>${registro.worker}</td><td>${new Date(registro.inicio).toISOString()}</td><td>${registro.duracionMs} ms</td><td>${escaparTexto(registro.estado)}</td></tr>`).join('');
  const coincidencias = evidencia.coincidencias.map(coincidencia => `<li>${coincidencia.pruebas.map(escaparTexto).join(' / ')}: <strong>${coincidencia.solapamientoMs} ms</strong> de coincidencia.</li>`).join('');
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Evidencia de ejecución paralela</title><style>body{font:15px/1.7 Arial,sans-serif;color:#263329;background:#f7f6f2;margin:50px auto;max-width:1150px;padding:0 30px}h1{font:38px Georgia,serif}p{color:#59644f}.datos{display:flex;gap:45px;margin:30px 0;padding:25px;background:white;border:1px solid #d9dfd0}.datos strong{font-size:30px;display:block}.datos span{font-size:12px}table{width:100%;border-collapse:collapse;background:white;font-size:12px}th,td{text-align:left;padding:14px;border:1px solid #d9dfd0}th{background:#e9eddf}h2{font-size:19px;margin-top:35px}li{font-size:13px;margin:15px 0}.nota{font-size:12px;margin-top:30px}</style></head><body><p>PLAYWRIGHT / REGISTRO DE UNA EJECUCIÓN REAL</p><h1>Ejecución paralela de pruebas</h1><p>Resultados registrados automáticamente al ejecutar npm test.</p><div class="datos"><div><strong>${evidencia.intervalos.length}</strong><span>Pruebas ejecutadas</span></div><div><strong>${evidencia.workersUtilizados.length}</strong><span>Workers utilizados</span></div><div><strong>${evidencia.paralelismoObservado ? 'Sí' : 'No'}</strong><span>Solapamiento observado</span></div><div><strong>${escaparTexto(evidencia.estado)}</strong><span>Estado de ejecución</span></div></div><table><thead><tr><th>Prueba</th><th>Worker</th><th>Inicio (UTC)</th><th>Duración</th><th>Estado</th></tr></thead><tbody>${filas}</tbody></table><h2>Intervalos coincidentes entre workers distintos</h2><ul>${coincidencias || '<li>No se observó solapamiento en esta ejecución.</li>'}</ul><p class="nota">Los intervalos provienen de startTime y duration del resultado de Playwright e incluyen la preparación y finalización de cada prueba. No se agregan esperas artificiales ni se afirma que cada clic ocurra en el mismo instante. Los índices de worker comienzan en cero y no garantizan un orden fijo.</p></body></html>`;
}
