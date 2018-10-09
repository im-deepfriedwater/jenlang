export class FieldValue {
  id: any
  expression: any

  constructor(id: any, expression: any) {
    this.id = id;
    this.expression = expression;
  }
  /* eslint-disable */
  analyze() {
    // empty on purpose!
  }
  /* eslint-enable */

  optimize() {
    return this;
  }
};
