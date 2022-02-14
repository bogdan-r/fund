class Statistics {
  private responseTimes: number[] = [];

  addResponseTime(time: number) {
    this.responseTimes.push(time);
  }

  calcMedian() {
    if (this.responseTimes.length == 0) {
      return 0;
    }

    const arrayHalf = this.responseTimes.length / 2;
    const sorted = [...this.responseTimes].sort((a, b) => a - b);

    return this.responseTimes.length % 2 === 0
      ? (sorted[arrayHalf] + sorted[arrayHalf + 1]) / 2
      : sorted[~~arrayHalf];
  }

  calcAverage() {
    if (this.responseTimes.length == 0) {
      return 0;
    }

    const sum = this.responseTimes.reduce((acc, time) => acc + time, 0);

    return sum / this.responseTimes.length;
  }

  toString() {
    return `
    Average response time: ${this.calcAverage()}
    Median response time: ${this.calcMedian()}
    `;
  }
}

export const statistics = new Statistics();
