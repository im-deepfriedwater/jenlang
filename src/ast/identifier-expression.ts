import { Context } from '../semantics/context';
import { Type } from './type';
import { Variable } from './variable'

export class IdentifierExpression {
  id: string;
  referent!: Variable;
  type!: Type;

  constructor(id: string) {
    this.id = id;
  }

  analyze(context: Context) {
    this.referent = context.lookup(this.id);
    this.type = this.referent.type;
  }

  optimize() { }

  // Depends on the generator, will be filled in later.
  gen() { }
};
