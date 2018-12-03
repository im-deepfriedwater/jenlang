import { BooleanLiteral } from './boolean-literal';
import { NumericLiteral } from './numeric-literal';
import { Context } from '../semantics/context';
import { Expression } from './typings';

export class UnaryExpression {
  operand: Expression;
  op: string;

  constructor(op: string, operand: Expression) {
    this.op = op;
    this.operand = operand;
    console.log(operand);
  }

  analyze(context: Context) {
    this.operand.analyze(context);
  }

  optimize(): UnaryExpression | BooleanLiteral | NumericLiteral {
    this.operand = this.operand.optimize();
    if (this.op === 'not' && this.operand instanceof BooleanLiteral) {
      return new BooleanLiteral(!this.operand.value);
    } else if (this.op === '-' && this.operand instanceof NumericLiteral) {
      return new NumericLiteral(-this.operand.value);
    }
    return this;
  }

  // Depends on the generator, will be filled in later.
  gen() { }
};
