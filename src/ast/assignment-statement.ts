export class AssignmentStatement {
  ids: any
  initializers: any
  constructor(ids: any, initializers: any) {
    Object.assign(this, { ids, initializers });
  }

  analyze(context: any) {
    if (!this.ids.length) {
      this.ids = [this.ids];
    }
    if (this.ids.length !== this.initializers.length) {
      throw new Error('Number of variables does not equal number of expressions');
    }
    this.initializers.forEach((s: any) => s.analyze(context));
    // look up the variable from context
    // look up variables not in the context, undeclared variable assignment error
    this.ids.forEach((id: any) => id.analyze(context));
    this.ids.forEach((id: any, i: any) => {
      id.referent.type.mustBeCompatibleWith(this.initializers[i].type, 'Type Mismatch at Assignment');
    });
  }

  optimize() {
    this.initializers.forEach((s: any) => s.optimize());
    this.ids.forEach((t: any) => t.optimize());
    return this;
  }

  // Depends on the generator, as such will be filled in later.
  gen(){}
};
