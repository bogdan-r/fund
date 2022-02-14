export enum RequestStates {
  SUCCESS = 'success',
  FAIL = 'fail',
  STUCK = 'stuck',
}
export interface StatisticLogItem {
  requestState: RequestStates;
}

class Statistics {
  private requests: StatisticLogItem[] = [];

  addRequestLog(log: StatisticLogItem) {
    this.requests.push(log);
  }

  getRequestCount() {
    return this.requests.length;
  }

  getSuccessfulRequestsCount() {
    return this.filterByState(RequestStates.SUCCESS).length;
  }
  getFailedRequestsCount() {
    return this.filterByState(RequestStates.FAIL).length;
  }
  getStuckRequestsCount() {
    return this.filterByState(RequestStates.STUCK).length;
  }

  private filterByState(state: RequestStates): StatisticLogItem[] {
    return this.requests.filter((request) => request.requestState == state);
  }

  toString() {
    return `
    Request count: ${this.getRequestCount()}
    Successful requests: ${this.getSuccessfulRequestsCount()}
    Failed requests: ${this.getFailedRequestsCount()}
    Stuck requests: ${this.getStuckRequestsCount()}
    `;
  }
}

export const statistics = new Statistics();
