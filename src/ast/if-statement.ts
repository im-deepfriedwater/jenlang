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
    this.cases.map((s: any) => s.optimize()).filter((s: any) => s !== null);
    this.alternate = this.alternate ? this.alternate.optimize() : null;
    return this;
  }

  // Depends on the generator, will be filled in later.
  gen() { }
};
