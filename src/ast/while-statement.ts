import { BooleanLiteral } from './boolean-literal';

export class WhileStatement {
  test: any;
  body: any;
  condition: any;

  constructor(test: any, body: any) {
    Object.assign(this, { test, body });
  }

  analyze(context: any) {
    this.test.analyze(context);
    const bodyContext = context.createChildContextForLoop();
    this.body.analyze(bodyContext);
  }

  optimize() {
    this.test = this.test.optimize();
    if (this.test instanceof BooleanLiteral && this.condition.value === false) {
      return null;
    }
    this.body.map((s: any) => s.optimize()).filter((s: any) => s !== null);
    // Suggested: Look for returns/breaks in the middle of the body
    return this;
  }
};
