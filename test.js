import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 5 },
    { duration: '20s', target: 5 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'],
  },
};

const URLS = [
  'https://httpbin.org/status/200',
  'https://httpbin.org/status/500',
  'https://httpbin.org/status/502',
  'https://httpbin.org/status/503',
  'https://httpbin.org/status/404',
  'https://httpbin.org/status/403',
  'https://httpbin.org/status/401',
];

export default function () {
  const url = URLS[Math.floor(Math.random() * URLS.length)];
  const res = http.get(url);

  check(res, {
    'status 200': (r) => r.status === 200,
  });

  sleep(1);
}