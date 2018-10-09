export class SubscriptedExpression {
  variable: any;
  subscript: any;
  
  constructor(variable: any, subscript: any) {
    Object.assign(this, { variable, subscript });
  }

  analyze(context: any) {
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
};
