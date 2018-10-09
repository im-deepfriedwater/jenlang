import { Context } from '../semantics/context';

export class Program {
  body: any;

  constructor(body: any) {
    this.body = body;
  }

  analyze() {
    const context = new Context({ parent: Context.INITIAL });
    this.body.analyze(context);
  }

  optimize() {
    this.body.optimize();
    return this;
  }
};
