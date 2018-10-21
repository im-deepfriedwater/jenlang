
import { Type } from './type'

export class Variable {
  id: string
  type: Type
  constructor(id: string, type = Type.ANY) {
    this.id = id;
    this.type = type;
  }
  analyze(context: any) {
    context.add(this);
  }
  optimize() {
    return this;
  }

  // Depends on the generator, will be filled in later.
  gen() { }
};