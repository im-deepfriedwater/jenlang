export class TernaryExpression {
  conditional: any;
  trueValue: any;
  falseValue: any;
  
  constructor(conditional: any, trueValue: any, falseValue: any) {
    Object.assign(this, { conditional, trueValue, falseValue });
  }

  analyze(context: any) {
    this.conditional.analyze(context);
    this.trueValue.analyze(context);
    this.falseValue.analyze(context);
  }

  optimize() {
    this.conditional = this.conditional.optimize();
    this.trueValue = this.trueValue.optimize();
    this.falseValue = this.falseValue.optimize();
    return this;
  }
  
  // Depends on the generator, will be filled in later.
  gen() { }
};
