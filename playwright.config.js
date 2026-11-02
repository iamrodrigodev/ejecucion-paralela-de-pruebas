import { defineConfig as definirConfiguracion } from '@playwright/test';

export default definirConfiguracion({
  testDir: '.',
  testMatch: 'demostracion.spec.js',
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['./reporte-paralelo.js']
  ],
  use: {
    baseURL: 'http://127.0.0.1:8002',
    browserName: 'chromium',
    channel: 'chromium',
    screenshot: 'on',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'node servidor.js',
    url: 'http://127.0.0.1:8002',
    reuseExistingServer: false
  }
});
