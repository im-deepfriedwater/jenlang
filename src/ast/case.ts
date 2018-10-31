export class Case {
  test: any;
  body: any;

  constructor(test: any, body: any) {
    Object.assign(this, { test, body });
  }

  analyze(context: any) {
    this.test.analyze(context);
    const bodyContext = context.createChildContextForBlock();
    this.body.analyze(bodyContext);
  }

  optimize() {
    this.test = this.test.optimize();
    // Suggested: if test is false, remove case. if true, remove following cases and the alt
    this.body.map((s: any) => s.optimize()).filter((s: any) => s !== null);
    // Suggested: Look for returns/breaks in the middle of the body
    return this;
  }
};
