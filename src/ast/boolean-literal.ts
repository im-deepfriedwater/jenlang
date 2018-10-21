import { Type } from './type'

export class BooleanLiteral {
  value: any
  type: any

  constructor(value: any) {
    this.value = value;
  }

  analyze() {
    this.type = Type.BOOLEAN;
  }

  optimize() {
    return this;
  }
  // Depends on the generator, will be filled in later.
  gen() { }
};
