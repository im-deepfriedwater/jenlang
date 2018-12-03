import { Type } from "./type";
import { Context } from '../semantics/context';

export class ErrorLiteral {
  value: any
  type: any

  constructor(value: any) {
    this.value = value;
  }

  analyze(context: Context) {
    this.type = Type.ERROR;
  }

  optimize() {
    return this;
  }

  // Depends on the generator, will be filled in later.
  gen() { }
};
