import { Type } from './type';
import { Context } from '../semantics/context';

export class BooleanLiteral {
  value: any
  type: any

  constructor(value: any) {
    this.value = value;
  }

  analyze(context: Context) {
    this.type = Type.BOOLEAN;
  }

  optimize() {
    return this;
  }
  // Depends on the generator, will be filled in later.
  gen() { }
};
