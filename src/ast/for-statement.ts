import { Variable } from './variable';
import { ListType } from '../ast/list-type';

export class ForStatement {
  ids: any
  expression: any
  body: any
  loopVariables: any
  constructor(ids: any, expression: any, body: any) {
    this.ids = ids;
    this.expression = expression;
    this.body = body;
  }

  analyze(context: any) {
    // We analyze the expression first so we can infer its type for our
    // loop variables.
    // Note that expressions in for loops only look outside for scope.
    this.expression.analyze(context);
    // Now we type check the for iterable to make sure it is a list type.
    if (!(this.expression.type instanceof ListType)) {
      throw new Error('Non-iterable used in for loop expression');
    }
    this.loopVariables = this.ids.map((id: any, i: any) => {
      const v = new Variable(id, this.expression.type.getMemberType());
      this.ids[i] = v;
      return v;
    });
    const bodyContext = context.createChildContextForLoop();
    this.loopVariables.forEach((v: any) => {
      bodyContext.add(v);
    });
    this.body.analyze(bodyContext);
  }

  optimize() {
    return this;
  }

  // Depends on the generator, will be filled in later.
  gen() { }
};
