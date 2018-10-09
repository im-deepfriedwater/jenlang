export class IfStatement {
  cases: any;
  alternate: any;

  constructor(cases: any, alternate: any) {
    Object.assign(this, { cases, alternate });
  }

  analyze(context: any) {
    this.cases.forEach((c: any) => c.analyze(context.createChildContextForBlock()));
    if (this.alternate) {
      this.alternate.analyze(context.createChildContextForBlock());
    }
  }

  optimize() {
    this.cases.map(s => s.optimize()).filter(s => s !== null);
    this.alternate = this.alternate ? this.alternate.optimize() : null;
    return this;
  }
};
