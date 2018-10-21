import { Type } from './type.js'

export class NumericLiteral {
  value: any;
  type: any;
  
  constructor(value: any) {
    this.value = value;
  }

  analyze() { // eslint-disable-line class-methods-use-this
    this.type = Type.NUMBER;
  }

  optimize() {
    return this;
  }

  // Depends on the generator, will be filled in later.
  gen() { }
};
