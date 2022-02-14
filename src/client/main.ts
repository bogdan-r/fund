import { statistics } from './statistics';
import { FundRequest } from './fund-request';

let currentPingId = 1;

setInterval(() => {
  new FundRequest(currentPingId++, {
    hostname: '127.0.0.1',
    port: '8080',
    method: 'POST',
    path: '/data',
    timeout: 10000,
  }).makeRequest();
}, 1000);

process.on('SIGINT', function () {
  console.log(statistics.toString());
  process.exit(1);
});
