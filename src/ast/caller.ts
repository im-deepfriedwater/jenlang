export class Caller {
  call: any
  constructor(c: any) {
    this.call = c;
  }

  analyze(context: any) {
    this.call.analyze(context);
  }

  optimize() {
    this.call = this.call.optimize();
    return this;
  }
};
