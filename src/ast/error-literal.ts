import { Type } from "./type";

export class ErrorLiteral {
  value: any
  type: any

  constructor(value: any) {
    this.value = value;
  }

  analyze() {
    this.type = Type.ERROR;
  }

  optimize() {
    return this;
  }

  // Depends on the generator, will be filled in later.
  gen() { }
};
