import { IncomingMessage, ServerResponse } from 'http';
import { statistics } from './statistics';
import { ResponseTimeInfo } from '../common/response-time-info';

export const endpoint = (req: IncomingMessage, res: ServerResponse) => {
  if (req.url === '/data' && req.method === 'POST') {
    noisyResponse(req, res);
  }
};

const noisyResponse = (req: IncomingMessage, res: ServerResponse) => {
  const okPercentage = 0.6;
  const failPercentage = 0.8;
  const percentage = Math.random();

  if (percentage < okPercentage) {
    handleOk(req, res);
  } else if (percentage < failPercentage) {
    handleFail(req, res);
  }
};

const handleOk = async (req: IncomingMessage, res: ServerResponse) => {
  req.statusCode = 200;
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  const payload = Buffer.concat(buffers).toString();
  const responseTimeInfo: ResponseTimeInfo = JSON.parse(payload);
  console.log(responseTimeInfo);
  statistics.addResponseTime(responseTimeInfo.responseTime);

  res.end('OK');
};
const handleFail = (req: IncomingMessage, res: ServerResponse) => {
  res.statusCode = 500;
  res.end();
};
