export class Parameter {
  id: any;
  defaultExpression: any;
  
  constructor(id: any) {
    Object.assign(this, { id });
  }

  get isRequired() {
    return this.defaultExpression === null;
  }

  analyze(context: any) {
    context.add(this);
  }

  optimize() {
    return this;
  }
};
