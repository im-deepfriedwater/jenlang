import { Type } from './type';
import { MultiType } from '../semantics/multi-type';
import { Context } from '../semantics/context';

export class BinaryExpression {
  op: any
  left: any
  right: any
  type: any
  constructor(op: any, left: any, right: any) {
    Object.assign(this, { op, left, right });
  }

  analyze(context: Context) {
    this.left.analyze(context);
    this.right.analyze(context);

    if (this.left.type instanceof MultiType || this.right.type instanceof MultiType) {
      throw new Error('Function with multiple return types in binary expression');
    } else if (['<=', '>=', '>', '<'].includes(this.op)) {
      this.mustHaveIntegerOperands();
      this.type = Type.BOOLEAN;
    } else if (['==', '!='].includes(this.op)) {
      this.mustHaveCompatibleOperands();
      this.type = Type.BOOLEAN;
    } else if (['&&', '||', '&!&'].includes(this.op)) {
      this.mustHaveBooleanOperands();
      this.type = Type.BOOLEAN;
    } else {
      // All other binary operators are arithmetic.
      this.mustHaveIntegerOperands();
      this.type = Type.NUMBER;
    }
  }

  mustHaveIntegerOperands() {
    const errorMessage = `${this.op} must have integer operands`;
    this.left.type.mustBeCompatibleWith(Type.NUMBER, errorMessage, this.op);
    this.right.type.mustBeCompatibleWith(Type.NUMBER, errorMessage, this.op);
  }
  mustHaveBooleanOperands() {
    const errorMessage = `${this.op} must have boolean operands`;
    this.left.type.mustBeCompatibleWith(Type.BOOLEAN, errorMessage, this.op);
    this.right.type.mustBeCompatibleWith(Type.BOOLEAN, errorMessage, this.op);
  }
  mustHaveCompatibleOperands() {
    const errorMessage = `${this.op} must have mutually compatible operands`;
    this.left.type.mustBeMutuallyCompatibleWith(this.right.type, errorMessage, this.op);
  }

  optimize() {
    this.left = this.left.optimize();
    this.right = this.right.optimize();
    return this;
  }
  // Depends on the generator, as such will be filled in later.
  gen() { }
};
