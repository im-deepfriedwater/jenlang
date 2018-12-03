import { Type } from './type.js'
import { Context } from "../semantics/context";


export class NumericLiteral {
  value: number;
  type!: Type;
  
  constructor(value: number) {
    this.value = value;
  }

  analyze(context: Context) { // eslint-disable-line class-methods-use-this
    this.type = Type.NUMBER;
  }

  optimize(): NumericLiteral {
    return this;
  }

  // Depends on the generator, will be filled in later.
  gen() { }
};
