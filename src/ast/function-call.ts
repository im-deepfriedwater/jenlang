import { MultiType } from '../semantics/multi-type';

export class Call {
  callee: any
  args: any
  type: any
  id: any

  constructor(callee: any, args: any) {
    this.callee = callee;
    this.args = args;
  }

  analyze(context: any) {
    this.callee.analyze(context);
    this.args.forEach((arg: any) => arg.analyze(context));
    context.assertIsFunction(this.callee.referent);
    this.checkArgumentMatching(this.callee.referent);
    // We put references to the type and id to the call object
    // for convenience at the type checking level.

    // First we check if the function has a simple single return type.
    // If so, we simplify the type to just that single type object.
    // Else, things get a little more complicated and we use our
    // multitype class.
    this.type = this.callee.referent.convertedResultTypes.length === 1 ?
      this.callee.referent.convertedResultTypes[0] :
      new MultiType(this.callee.referent.convertedResultTypes);
    this.id = this.callee.id;
  }

  checkArgumentMatching(callee: any) {
    if (callee.params[0] === 'void' && this.args.length === 0) {
      return;
    } else if (this.args.length > callee.params.length) {
      throw new Error('Too many arguments in call');
    } else if (this.args.length < callee.params.length) {
      throw new Error('Too little arguments in call');
    }

    this.args.forEach((arg: any, index: any) => {
      arg.type.mustBeCompatibleWith(callee.convertedParamTypes[index], 'Type Mismatch at Function Call');
    });
  }

  optimize() {
    this.callee = this.callee.optimize();
    this.args.forEach((arg: any) => arg.optimize());
    return this;
  }
};
