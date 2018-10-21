export class IdentifierExpression {
  id: any
  referent: any
  type: any

  constructor(id: any) {
    this.id = id;
  }

  analyze(context: any) {
    this.referent = context.lookup(this.id);
    this.type = this.referent.type;
  }

  // Depends on the generator, will be filled in later.
  gen() { }
};
