import { Context } from '../semantics/context';

export class SubscriptedExpression {
  variable: any;
  subscript: any;
  referent: any;
  type: any;
  
  constructor(variable: any, subscript: any) {
    Object.assign(this, { variable, subscript });
  }

  analyze(context: Context) {
    this.variable.analyze(context);
    this.subscript.analyze(context);
    this.referent = this.variable.referent;
    this.type = this.variable.referent.type.getMemberType();
  }

  optimize() {
    this.variable = this.variable.optimize();
    this.subscript = this.subscript.optimize();
    return this;
  }

  // Depends on the generator, will be filled in later.
  gen() { }
};
