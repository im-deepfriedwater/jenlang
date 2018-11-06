/*
 * Credit to @rtoal
 * https://github.com/rtoal/plainscript
 * Semantic Analysis Context
 *
 * A context object holds state for the semantic analysis phase, such as the
 * enclosing function (if any), whether or not we are in a loop, a map of
 * declarations introduced in this scope, and the parent context.
 *
 *   const Context = require('./semantics/context');
 */
import { FunctionObject } from '../ast/function-object';
import { FunctionDeclaration } from '../ast/function-declaration';
import { Annotation } from '../ast/annotation';
import { Signature } from '../ast/signature';
import { IdentifierExpression } from '../ast/identifier-expression';
import { ListType } from '../ast/list-type';

interface ContextInterface {
  parent?: Context | null;
  currentFunction?: any;
  inLoop?: boolean;
}

export class Context {

  static INITIAL = new Context();

  parent!: Context | null;
  currentFunction: any | null;
  inLoop: any;
  declarations: any;
  sumTypeDeclarations!: any[];


  constructor({ parent = null, currentFunction = null, inLoop = false }: ContextInterface = {}) {
    Object.assign(this, {
      parent,
      currentFunction,
      inLoop,
      declarations: Object.create(null),
      sumTypeDeclarations: Object.create(null),
    });
  }

  createChildContextForFunctionBody(currentFunction: any): Context {
    // When entering a new function, we're not in a loop anymore
    return new Context({ parent: this, currentFunction, inLoop: false });
  }

  createChildContextForLoop(): Context {
    // When entering a loop body, just set the inLoop field, retain others
    return new Context({ parent: this, currentFunction: this.currentFunction, inLoop: true });
  }

  createChildContextForBlock(): Context {
    // For a simple block (i.e., in an if-statement), we have to retain both
    // the function and loop settings.
    return new Context({
      parent: this,
      currentFunction: this.currentFunction,
      inLoop: this.inLoop,
    });
  }

  // Call this to add a new entity (which could be a variable, a function,
  // or a parameter) to this context. It will check to see if the entity's
  // identifier has already been declared in this context. It does not need
  // to check enclosing contexts because in this language, shadowing is always
  // allowed. Note that if we allowed overloading, this method would have to
  // be a bit more sophisticated.
  add(entity: any){
    if (entity.id in this.declarations) {
      throw new Error(`Identitier ${entity.id} already declared in this scope`);
    }
    this.declarations[entity.id] = entity;
  }

  // Returns the entity bound to the given identifier, starting from this
  // context and searching "outward" through enclosing contexts if necessary.
  lookup(id: any): any {
    if (id in this.declarations) {
      return this.declarations[id];
    } else if (this.parent === null) {
      throw new Error(`Identifier ${id} has not been declared`);
    } else {
      return this.parent.lookup(id);
    }
  }

  // These two methods lookup and lookupSumType are very similar. These two
  // could possibly be cleaned up later.

  // Similar to looking up entities bound to an identifier but specifically for
  // type declarations. Note, sum types also search outward through enclosing
  // contexts if necessary.
  lookupSumType(sumTypeId: any): any {
    const id = sumTypeId instanceof IdentifierExpression ? sumTypeId.id : sumTypeId;
    if (id in this.sumTypeDeclarations) {
      return this.sumTypeDeclarations[id];
    } else if (this.parent === null) {
      throw new Error(`Type identifier ${id} has not been declared`);
    } else {
      return this.parent.lookupSumType(id);
    }
  }
  assertInFunction(message: any) {
    if (!this.currentFunction) {
      throw new Error(message);
    }
  }

  assertIsFunction(entity: any) { // eslint-disable-line class-methods-use-this
    if (entity.constructor !== FunctionObject) {
      throw new Error(`${entity.id} is not a function`);
    }
  }

  assertInLoop(message: any) {
    if (!this.inLoop) {
      throw new Error(message);
    }
  }

  assertRecordNoDuplicateFields(record: any, message: any) { // eslint-disable-line class-methods-use-this
    const uniqueFields = new Set();
    record.fields.forEach((f: any) => {
      if (uniqueFields.has(f.id)) {
        throw new Error(message);
      }
      uniqueFields.add(f.id);
    });
  }

  assertIsField(nameOfRecord: any, field: any) {
    const currentRecord = this.lookup(nameOfRecord);
    const fieldTest = (currentField: any) => currentField === field;
    return currentRecord.fields.some(fieldTest);
  }

  addSumType(id: any, sumType: any) {
    this.sumTypeDeclarations[id] = sumType;
  }

  matchListType(seenTypes: any) {
    const message = 'Invalid List Expression for a non-existing type';

    const match = Object.keys(this.sumTypeDeclarations).find((id: any) =>
      Array.from(seenTypes).every(seenType =>
        this.sumTypeDeclarations[id].isCompatibleWith(seenType)));

    if (!match) {
      throw message;
    }
  }
}

new FunctionDeclaration(new Annotation('print', ['any'], ['void']), new Signature('print', ['s']), []).analyze(Context.INITIAL);
new FunctionDeclaration(new Annotation('sqrt', ['number'], ['number']), new Signature('sqrt', ['x']), []).analyze(Context.INITIAL);
new FunctionDeclaration(new Annotation('pi', ['void'], ['number']), new Signature('pi', []), []).analyze(Context.INITIAL);
new FunctionDeclaration(new Annotation('toUpper', ['string'], ['string']), new Signature('toUpper', ['stringToUpper']), []).analyze(Context.INITIAL);
new FunctionDeclaration(new Annotation('toLower', ['string'], ['string']), new Signature('toLower', ['stringToLower']), []).analyze(Context.INITIAL);
new FunctionDeclaration(new Annotation('random', ['void'], ['number']), new Signature('random', []), []).analyze(Context.INITIAL);
new FunctionDeclaration(new Annotation('range', ['number'], [new ListType('number')]), new Signature('range', ['i']), []).analyze(Context.INITIAL);
