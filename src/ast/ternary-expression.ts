import { Context } from '../semantics/context';
import { Expression } from './typings';

export class TernaryExpression {
  conditional: Expression;
  trueValue: Expression;
  falseValue: Expression;
  
  constructor(conditional: Expression, trueValue: Expression, falseValue: Expression) {
    console.log(conditional);
    Object.assign(this, { conditional, trueValue, falseValue });
  }

  analyze(context: Context): void { // TODO type check conditional
    this.conditional.analyze(context);
    this.trueValue.analyze(context);
    this.falseValue.analyze(context);
  }

  optimize(): TernaryExpression{
    this.conditional = this.conditional.optimize();
    this.trueValue = this.trueValue.optimize();
    this.falseValue = this.falseValue.optimize();
    return this;
  }
  
  // Depends on the generator, will be filled in later.
  gen() { }
};
