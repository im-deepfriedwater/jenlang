import { ListType } from './list-type';
import { Context } from '../semantics/context';

export class ListExpression {
  type!: ListType;
  values: any;

  constructor(values: any) {
    Object.assign(this, { values });
  }

  analyze(context: Context) {
    this.values.forEach((v: any) => v.analyze(context));
    this.type = new ListType(this.values);
    this.type.analyze(context);
  }

  optimize() {
    return this;
  }

  // Depends on the generator, will be filled in later.
  gen() { }
};
