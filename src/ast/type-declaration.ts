export class TypeDeclaration {
  id: any;
  sumType: any;
  
  constructor(id: any, sumType: any) {
    Object.assign(this, { id, sumType });
  }

  analyze(context: any) {
    this.sumType.analyze(context);
    context.addSumType(this.id, this.sumType);
  }

  /* eslint-disable class-methods-use-this */
  optimize() {
    // Purposefully empty for now!
  }
};
