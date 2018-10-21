/*
 * Heavily inspired by Ray Toal's javascript generator for plainscript: https://github.com/rtoal/plainscript/tree/master/backend
 *
 * Translation to Python
 *
 * Requiring this module adds a gen() method to each of the AST classes.
 * Nothing is actually exported from this module.
 *
 * Generally, calling e.gen() where e is an expression node will return the
 * Python translation as a string, while calling s.gen() where s is a
 * statement-level node will write its translation to standard output.
 *
 *   import {} from './backend/python-generator'
 *   program.gen();
 */

import { Context } from '../semantics/context';
import { Program } from '../ast/program';
import { VariableDeclaration } from '../ast/variable-declaration';
import { AssignmentStatement } from '../ast/assignment-statement';
import { BreakStatement } from '../ast/break';
import { ReturnStatement } from '../ast/return';
import { WhileStatement } from '../ast/while-statement';
import { IfStatement } from '../ast/if-statement';
import { Call as FunctionCall } from '../ast/function-call';
import { FunctionDeclaration } from '../ast/function-declaration';
import { FunctionObject } from '../ast/function-object';
import { BinaryExpression } from '../ast/binary-expression';
import { UnaryExpression } from '../ast/unary-expression';
import { IdentifierExpression } from '../ast/identifier-expression';
import { SubscriptedExpression } from '../ast/subscripted-expression';
import { Variable } from '../ast/variable';
import { BooleanLiteral } from '../ast/boolean-literal';
import { NumericLiteral } from '../ast/numeric-literal';
import { StringLiteral } from '../ast/string-literal';
import { ErrorLiteral } from '../ast/error-literal';
import { Caller } from '../ast/caller';
import { TypeDeclaration } from '../ast/type-declaration';
import { Accessor } from '../ast/accessor';
import { ForStatement } from '../ast/for-statement';
import { ListExpression } from '../ast/list';
import { ListType as ListTypeExpression } from '../ast/list-type';

const indentPadding = 2;
const OP_DICTIONARY : { [key: string]: string } = {
  '&&': 'and',
  '||': 'or',
  '!': 'not',
  '^': '**',
};

let indentLevel = 0;

function emit(line: any) {
  console.log(`${' '.repeat(indentPadding * indentLevel)}${line}`); // eslint-disable-line no-console
}

function genStatementList(statements: any) {
  indentLevel += 1;
  statements.forEach((statement: any) => statement.gen());
  indentLevel -= 1;
}

function makeOp(op: string): string {
  return OP_DICTIONARY[op] || op;
}

// pythonName(e) takes any jen object with an id property, such as a
// Variable, Parameter, or FunctionDeclaration, and produces a Python
// name by appending a unique indentifying suffix, such as '_1' or '_503'.
// It uses a cache so it can return the same exact string each time it is
// called with a particular entity.
const pythonName = (() => {
  let lastId = 0;
  const map = new Map();
  return (v: any) => {
    if (!(map.has(v))) {
      map.set(v, ++lastId); // eslint-disable-line no-plusplus
    }
    return `${v.id}_${map.get(v)}`;
  };
})();

// This is a nice helper for variable declarations and assignment statements.
// The AST represents both of these with lists of sources and lists of targets,
// but when writing out JavaScript it seems silly to write `[x] = [y]` when
// `x = y` suffices.
function parenthesisIfNecessary(a: any) {
  if (a.length === 1) {
    return `${a}`;
  }
  return `(${a.join(', ')})`;
}

function generateLibraryFunctions() {
  function generateLibraryStub(name: any, params: any, body: any) {
    const entity = Context.INITIAL.declarations[name];
    emit(`def ${pythonName(entity)} (${params}):\n  ${body}`);
  }
  // This is sloppy. There should be a better way to do this.
  emit('import math');
  emit('import random');
  generateLibraryStub('print', 's', 'print(s)');
  generateLibraryStub('pi', '', 'return math.pi');
  generateLibraryStub('sqrt', 'x', 'return math.sqrt(x)');
  generateLibraryStub('toUpper', 's', 'return s.upper()');
  generateLibraryStub('toLower', 's', 'return s.lower()');
  generateLibraryStub('random', '', 'return random.random()');
  generateLibraryStub('range', 'i', 'return range(i)');
}

function generateErrorLiteral() {
  emit('ok = \'ok\'');
  emit('err = \'err\'');
}

Accessor.prototype.gen = function () {
  const object: any = this.object.gen();
  if (this.property === 'length') {
    return (`len(${(object)})`);
  }
  const property = this.property.gen();
  return (`${(object)}.${(property)}`);
};

AssignmentStatement.prototype.gen = function () {
  const ids = this.ids.map((id: any) => id.gen());
  const initializers = this.initializers.map((i: any) => i.gen());
  emit(`${(ids)} = ${(initializers)}`);
}

BinaryExpression.prototype.gen = function () {
  if (this.op === '&!&') {
    return `((${this.left.gen()} and not ${this.right.gen()}) or \
(not ${this.left.gen()} and ${this.right.gen()}))`;
  }
  if (this.op === '/%') {
    return `(divmod(${this.left.gen()}, ${this.right.gen()}))`;
  }
  return `(${this.left.gen()} ${makeOp(this.op)} ${this.right.gen()})`;
};

BooleanLiteral.prototype.gen = function () {
  const value: string = this.value ? 'True' : 'False';
  return `${value}`;
};

BreakStatement.prototype.gen = function () {
  emit('break');
};

Caller.prototype.gen = function () {
  emit(`${this.call.gen()}`);
};

FunctionCall.prototype.gen = function () {
  const fun: any = this.callee.referent;
  const { params } = this.callee.referent; // eslint-disable-line no-unused-vars
  const { args } = this;
  return (`${pythonName(fun)}(${args.map((a: any) => (a ? a.gen() : 'undefined')).join(', ')})`);
};

FunctionDeclaration.prototype.gen = function () {
  return this.function.gen();
};

FunctionObject.prototype.gen = function () {
  emit(`def ${pythonName(this)}(${this.params.map((p: any) => p.gen()).join(', ')}):`);
  genStatementList(this.suite.statements);
};

IdentifierExpression.prototype.gen = function () {
  return this.referent.gen();
};

IfStatement.prototype.gen = function () {
  this.cases.forEach((c: any, index: any) => {
    const prefix = index === 0 ? 'if' : 'elif';
    emit(`${prefix} ${c.test.gen()}:`);
    genStatementList(c.body.statements);
  });
  if (this.alternate) {
    emit('else: ');
    genStatementList(this.alternate.statements);
  }
};

NumericLiteral.prototype.gen = function () {
  return `${this.value}`;
};

Program.prototype.gen = function () {
  generateLibraryFunctions();
  generateErrorLiteral();
  this.body.statements.forEach((statement: any) => statement.gen());
};

ReturnStatement.prototype.gen = function () {
  if (this.returnValue) {
    emit(`return ${parenthesisIfNecessary(this.returnValue.map((r: any) => r.gen()))}`);
  } else {
    emit('return');
  }
};

StringLiteral.prototype.gen = function () {
  return `${this.value}`;
};

SubscriptedExpression.prototype.gen = function () {
  const base = this.variable.gen();
  const subscript = this.subscript.gen();
  return `${base}[${subscript}]`; 
};

UnaryExpression.prototype.gen = function () {
  return `(${makeOp(this.op)}${this.operand.gen()})`;
};

VariableDeclaration.prototype.gen = function () {
  const variables = this.variables.map((v: any) => v.gen());
  const initializers = this.initializers.map((i: any) => i.gen());
  emit(`${(variables)} = ${(initializers)}`);
};

Variable.prototype.gen = function () {
  return pythonName(this);
};

WhileStatement.prototype.gen = function () {
  emit(`while ${this.test.gen()}: `);
  genStatementList(this.body.statements);
};

ForStatement.prototype.gen = function () {
  const ids = this.ids.map((i: any) => i.gen());
  const expression = this.expression.gen();
  emit(`for ${(ids)} in ${(expression)}:`);
  genStatementList(this.body.statements);
};

ErrorLiteral.prototype.gen = function () {
  return `${this.value}`;
};

// Type checking is purely semantic as of now.
TypeDeclaration.prototype.gen = function () {
  emit('');
}

ListTypeExpression.prototype.gen = function () {
  return '';
};

ListExpression.prototype.gen = function () {
  const values = this.values.map((v: any) => v.gen());
  return `[${values}]`;
};