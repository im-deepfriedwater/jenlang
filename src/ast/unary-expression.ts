import { BooleanLiteral } from './boolean-literal';
import { NumericLiteral } from './numeric-literal';

export class UnaryExpression {
  operand: any;
  op: string;

  constructor(op: any, operand: any) {
    this.op = op;
    this.operand = operand
  }

  analyze(context: any) {
    this.operand.analyze(context);
  }

  optimize() {
    this.operand = this.operand.optimize();
    if (this.op === 'not' && this.operand instanceof BooleanLiteral) {
      return new BooleanLiteral(!this.operand.value);
    } else if (this.op === '-' && this.operand instanceof NumericLiteral) {
      return new NumericLiteral(-this.operand.value);
    }
    return this;
  }
};
