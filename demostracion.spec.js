import { test as prueba, expect as esperar } from '@playwright/test';

prueba.beforeEach(async ({ page: pagina }) => {
  await pagina.goto('/');
});

prueba('identifica el título y el encabezado', async ({ page: pagina }) => {
  await esperar(pagina).toHaveTitle('Paralelo · Pruebas independientes');
  await esperar(pagina.getByRole('heading', { level: 1 })).toHaveText('Independientes.Al mismo tiempo.');
});

prueba('presenta un saludo con el nombre ingresado', async ({ page: pagina }) => {
  await pagina.getByLabel('Tu nombre').fill('Lucía');
  await pagina.getByRole('button', { name: 'Mostrar saludo' }).click();
  await esperar(pagina.getByRole('status', { name: 'Saludo personalizado' })).toHaveText('Hola, Lucía.');
});

prueba('incrementa un contador independiente desde cero', async ({ page: pagina }) => {
  const contador = pagina.getByLabel('Valor del contador');
  await esperar(contador).toHaveText('0');
  await pagina.getByRole('button', { name: 'Incrementar', exact: true }).click();
  await pagina.getByRole('button', { name: 'Incrementar', exact: true }).click();
  await esperar(contador).toHaveText('2');
});
