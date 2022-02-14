import * as http from 'http';
import https from 'https';
import { ResponseTimeInfo } from '../common/response-time-info';
import { RequestStates, statistics } from './statistics';

const fundRequestOptions: https.RequestOptions = {
  hostname: 'fundraiseup.com',
  port: 443,
  method: 'GET',
  path: '/',
};

export class FundRequest {
  private readonly id: number;
  private readonly serverRequestOptions: http.RequestOptions;
  private startReqAt: number | undefined;
  private endReqAt: number | undefined;

  private attempt: number = 1;

  constructor(id: number, options: http.RequestOptions) {
    this.id = id;
    this.serverRequestOptions = options;
  }

  makeRequest() {
    this.startReqAt = Date.now();
    https.request(fundRequestOptions, (res) => this.handleFundReq(res)).end();
  }

  private getResponseTime() {
    if (this.endReqAt && this.startReqAt) {
      return this.endReqAt - this.startReqAt;
    }
    return 0;
  }

  private sendToServer() {
    const params = this.buildDataForServer();
    const data = JSON.stringify(params);

    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    };
    console.log(`Send to server:`);
    console.log(params);
    const req = http.request({ ...this.serverRequestOptions, headers }, (res) =>
      this.handleServerReq(res),
    );

    req.on('timeout', () => this.handleServerTimeout());
    req.write(data);
    req.end();
  }

  private makeNewAttempt() {
    console.log('makeNewAttempt');
    this.attempt++;
    const delay = Math.round((Math.pow(2, this.attempt) - 1) * 1000);
    setTimeout(() => this.sendToServer(), delay);
  }

  private buildDataForServer(): ResponseTimeInfo {
    return {
      pingId: this.id,
      responseTime: this.getResponseTime(),
      date: Date.now(),
      deliveryAttempt: this.attempt,
    };
  }

  private handleFundReq(res: http.IncomingMessage) {
    if (res.statusCode === 200) {
      this.endReqAt = Date.now();
      this.sendToServer();
    }
  }

  private handleServerReq(res: http.IncomingMessage) {
    if (res.statusCode === 500) {
      this.handleServerError();
    }
    statistics.addRequestLog({ requestState: RequestStates.SUCCESS });
  }

  private handleServerError() {
    statistics.addRequestLog({ requestState: RequestStates.FAIL });
    this.makeNewAttempt();
  }

  private handleServerTimeout() {
    statistics.addRequestLog({ requestState: RequestStates.STUCK });
    this.makeNewAttempt();
  }
}
