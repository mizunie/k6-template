import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 5 },
    { duration: '20s', target: 10 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'],
  },
};

// URLs base que se comparten entre endpoints (simulando servicios reales)
const BASE_URL = 'https://httpbin.org';

// Misma URL, diferentes comportamientos simulados
const ENDPOINTS = [
  { path: '/api/usuarios',    codes: [200, 200, 200, 500] },           // 75% éxito, 25% error servidor
  { path: '/api/productos',   codes: [200, 200, 500, 503] },           // 50% éxito, 50% error
  { path: '/api/auth/login',  codes: [200, 401, 401, 500] },           // 25% éxito, 75% error
  { path: '/api/pagos',       codes: [200, 200, 200, 200, 502] },      // 80% éxito, 20% error
  { path: '/api/buscar',      codes: [200, 200, 404] },                // 67% éxito, 33% no encontrado
  { path: '/api/admin',       codes: [200, 403, 500] },                // 33% éxito, 66% errores
];

function getStatusCode(code) {
  switch (true) {
    case code === 200: return '/status/200';
    case code === 201: return '/status/201';
    case code === 301: return '/status/301';
    case code === 302: return '/status/302';
    case code === 400: return '/status/400';
    case code === 401: return '/status/401';
    case code === 403: return '/status/403';
    case code === 404: return '/status/404';
    case code === 500: return '/status/500';
    case code === 502: return '/status/502';
    case code === 503: return '/status/503';
    default: return '/status/500';
  }
}

export default function () {
  // Elegir un endpoint aleatorio
  const endpoint = ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)];
  
  // Elegir un código de respuesta aleatorio entre los definidos para ese endpoint
  const code = endpoint.codes[Math.floor(Math.random() * endpoint.codes.length)];
  
  // Usar httpbin para forzar ese código, pero guardamos la URL "lógica" como name
  const res = http.get(`${BASE_URL}${getStatusCode(code)}`, {
    timeout: '30s',
    tags: { name: `${BASE_URL}${endpoint.path}` },  // 👈 Forzamos el name para que k6 agrupe por la URL lógica
  });

  // Checks basados en el código simulado
  check(res, {
    'status 200': (r) => r.status === 200,
    'status is 2xx': (r) => r.status >= 200 && r.status < 300,
    'status is 3xx': (r) => r.status >= 300 && r.status < 400,
    'status is 4xx': (r) => r.status >= 400 && r.status < 500,
    'status is 5xx': (r) => r.status >= 500 && r.status < 600,
    'response time < 2000ms': (r) => r.timings.duration < 2000,
    'response time < 5000ms': (r) => r.timings.duration < 5000,
  });

  sleep(1);
}