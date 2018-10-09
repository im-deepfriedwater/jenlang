import { Type } from './type.js';

export class StringLiteral {
  value: any;
  type: any;
  
  constructor(value: any) {
    this.value = value;
  }

  analyze() { // eslint-disable-line class-methods-use-this
    this.type = Type.STRING;
  }

  optimize() {
    return this;
  }
};
