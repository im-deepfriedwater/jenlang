import { BooleanLiteral } from './boolean-literal';
import { Context } from '../semantics/context';
import { Expression } from './typings';
import { Body } from './body';

export class WhileStatement {
  test!: Expression;
  body!: Body;

  constructor(test: Expression, body: Body) {
    Object.assign(this, { test, body });
  }

  analyze(context: Context) {
    this.test.analyze(context);
    const bodyContext = context.createChildContextForLoop();
    this.body.analyze(bodyContext);
  }

  optimize() {
    this.test = this.test.optimize();
    if (typeof this.test === 'BooleanLiteral' && !this.condition.value) {
      return null;
    }
    this.body.statements.map((s: any) => s.optimize()).filter((s: any) => s !== null);
    // Suggested: Look for returns/breaks in the middle of the body
    return this;
  }

  // Depends on the generator, will be filled in later.
  gen() { }
};
