import { createServer, IncomingMessage, ServerResponse } from 'http';
import { endpoint } from './endpoint';
import { statistics } from './statistics';
const hostname = '127.0.0.1';
const port = 8080;

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  endpoint(req, res);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

process.on('SIGINT', function () {
  server.close();
  console.log(statistics.toString());
  process.exit(1);
});
