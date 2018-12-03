import { Variable } from './variable';
import { Caller } from './caller';
import { Expression, Initializers } from './typings';
import { Type } from './type';

import { Context } from '../semantics/context';

// A VariableDeclaration declares one or more variables. The variable objects
// will be created during semantic analysis.
export class VariableDeclaration {

  initializers: Initializers;
  ids: string[];
  variables!: Variable[];

  // During syntax analysis (parsing), all we do is collect the variable names.
  // We will make the variable objects later, because we have to add them to a
  // semantic analysis context.
  constructor(ids: string[], initializers: Initializers) {
    this.ids = ids;
    this.initializers = initializers;
  }

  analyze(context: Context) {
    // analyze first so functionCalls get analyzed
    this.initializers.forEach((e: Expression) => e.analyze(context));
    // Checking if the right side is a call or a function call
    // If so, add the type of the return values
    const types: Type[] = [];
    this.initializers.forEach((i: Expression) => {
      if (i instanceof Caller) {
        types.push(...(i.call.callee.referent.type));
      } else if (i.callee) {
        console.log('HELP', i.callee);
        types.push(...(i.callee.referent.type));
      } else {
        types.push(i.type);
      }
    });

    if (this.ids.length !== types.length) {
      throw new Error('Number of variables does not equal number of initializers');
    }

    // We don't want the declared variables to come into scope until after the
    // declaration line, so we will analyze all the initializing expressions
    // first.

    // Now we can create actual variable objects and add to the current context.
    this.variables = this.ids.map((id, i) => new Variable(id, types[i]));
    this.variables.forEach((v: Variable) => v.analyze(context));
  }

  optimize() {
    return this;
  }

  // Depends on the generator, will be filled in later.
  gen() { }
};