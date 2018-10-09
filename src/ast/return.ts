export class ReturnStatement {
  returnValue: any;
  constructor(returnValue: any) {
    this.returnValue = returnValue;
  }

  analyze(context: any) {
    context.assertInFunction('Return statement outside function');
    if (this.returnValue) {
      this.returnValue.forEach((value: any) => value.analyze(context));
    }
  }

  optimize() {
    if (this.returnValue) {
      this.returnValue = this.returnValue.optimize();
    }
    return this;
  }
};
