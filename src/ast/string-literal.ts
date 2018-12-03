import { Type } from './type.js';
import { Context } from '../semantics/context';

export class StringLiteral {
  value: any;
  type: any;
  
  constructor(value: any) {
    this.value = value;
  }

  analyze(context: Context) { // eslint-disable-line class-methods-use-this
    this.type = Type.STRING;
  }

  optimize() {
    return this;
  }
  
  // Depends on the generator, will be filled in later.
  gen() { }
};
