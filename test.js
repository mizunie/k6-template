import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  let res = http.get('https://test-api.k6.io/public/crocodiles/');
  
  check(res, {
    'status es 200': (r) => r.status === 200,
    'cuerpo no está vacío': (r) => r.body && r.body.length > 0,
  });
  
  sleep(1);
}