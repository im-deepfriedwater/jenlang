import { ListType } from './list-type';

export class ListExpression {
  years: any;
  type: any;
  values: any;

  constructor(values: any) {
    Object.assign(this, { values });
  }

  analyze(context: any) {
    this.values.forEach((v: any) => v.analyze(context));
    this.type = new ListType(this.values);
    this.type.analyze(context);
  }

  optimize() {
    return this;
  }
};
