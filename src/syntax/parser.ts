// Parser module specifically for jen
//
// Heavily inspired by Ray Toal's parser for iki:
// https://github.com/rtoal/iki-compiler
//
// For use:
//
// const parser = require('./parser');
// const program = parse(sourceCodeString);

import { ohm } from 'ohm-js';
import { fs } from 'fs'
import { withIndentsAndDedents } from './preparser.js';

import { Program } from '../ast/program';
import { Body } from '../ast/body';
import { VariableDeclaration as VarDec } from '../ast/variable-declaration';
import { AssignmentStatement as VarAsgn } from '../ast/assignment-statement';

import { BooleanLiteral } from '../ast/boolean-literal';
import { NumericLiteral } from '../ast/numeric-literal';
import { StringLiteral } from '../ast/string-literal';
import { RecordLiteral } from '../ast/record-literal';
import { FieldValue } from '../ast/field-value';
import { WhileStatement } from '../ast/while-statement';
import { BreakStatement } from '../ast/break';
import { BinaryExpression } from '../ast/binary-expression';
import { UnaryExpression } from '../ast/unary-expression';
import { SubscriptedExpression } from '../ast/subscripted-expression';
import { Call as FunctionCall } from '../ast/function-call';
import { FunctionDeclaration } from '../ast/function-declaration';
import { ReturnStatement as Return } from '../ast/return';
import { TernaryExpression } from '../ast/ternary-expression';
import { ErrorLiteral } from '../ast/error-literal';
import { ForStatement } from '../ast/for-statement';
import { Case } from '../ast/case';
import { IfStatement } from '../ast/if-statement';
import { Accessor } from '../ast/accessor';
import { ListExpression } from '../ast/list';
import { ListType as ListTypeExpression } from '../ast/list-type';
import { TypeDeclaration } from '../ast/type-declaration';
import { SumType as SumTypeClass } from '../ast/sum-type';
import { Signature as FuncSignature } from '../ast/signature';
import { Annotation as FuncAnnotation } from '../ast/annotation';
import { IdentifierExpression } from '../ast/identifier-expression';
import { Caller } from '../ast/caller';


// Credit to Ray Toal:
// Ohm turns `x?` into either [x] or [], which we should clean up for our AST.
const unpack = (a: any) => (a.length === 0 ? null : a[0]);

const grammar = ohm.grammar(fs.readFileSync('./syntax/jen.ohm'));
/* eslint-disable no-unused-vars */
const astGenerator = grammar.createSemantics().addOperation('ast', {
  Program(_1: any, body: any, _2: any) { return new Program(body.ast()); },
  Body(expressionsAndStatements: any) { return new Body(expressionsAndStatements.ast()); },
  Suite(_1: any, _2: any, body: any, _3: any) { return body.ast(); },
  /* eslint-disable no-undef */
  Conditional(_1: any, firstTest: any, _2: any, firstSuite: any, _3: any, moreTests: any, _4: any, moreSuites: any, _5: any, _6: any, lastSuite: any) {
    const tests = [firstTest.ast(), ...moreTests.ast()];
    const bodies = [firstSuite.ast(), ...moreSuites.ast()];
    const cases = tests.map((test, index) => new Case(test, bodies[index]));
    return new IfStatement(cases, unpack(lastSuite.ast()));
  },
  Statement_declaration(body: any, _: any) { return body.ast(); },
  Statement_assignment(body: any, _: any) { return body.ast(); },
  Statement_call(c: any, _: any) { return new Caller(c.ast()); },
  Statement_typedec(body: any, _: any) { return body.ast(); },
  Statement_return(returnStmt: any, _: any) { return returnStmt.ast(); },
  Statement_break(_1: any, _2: any) { return new BreakStatement(); },
  Statement_expression(body: any, _: any) { return body.ast(); },
  Declaration(ids: any, _: any, exps: any) { return new VarDec(ids.ast(), exps.ast()); },
  Assignment(ids: any, _: any, exps: any) { return new VarAsgn(ids.ast(), exps.ast()); },
  For(_1: any, ids: any, _2: any, exps: any, _3: any, suite: any) {
    return new ForStatement(ids.ast(), exps.ast(), suite.ast());
  },
  While(_1: any, exps: any, _2: any, suite: any) { return new WhileStatement(exps.ast(), suite.ast()); },
  TypeDec(_1: any, id: any, _2: any, sumType: any) { return new TypeDeclaration(id.ast(), sumType.ast()); },
  Return(_: any, e: any) { return new Return(e.ast()); },
  FuncDec(annotation: any, _1: any, signature: any, _2: any, suite: any) {
    return new FunctionDeclaration(annotation.ast(), signature.ast(), suite.ast());
  },
  Signature(id: any, _2: any, params: any, _3: any) { return new FuncSignature(id.ast(), params.ast()); },
  Annotation(id: any, _1: any, paramTypes: any, _2: any, resultTypes: any) {
    return new FuncAnnotation(id.ast(), paramTypes.ast(), resultTypes.ast());
  },
  Expression_ternary(conditional: any, _1: any, trueValue: any, _2: any, falseValue: any) {
    return new TernaryExpression(conditional.ast(), trueValue.ast(), falseValue.ast());
  },
  Exp0_and(left: any, op: any, right: any) { return new BinaryExpression(op.ast(), left.ast(), right.ast()); },
  Exp0_or(left: any, op: any, right: any) { return new BinaryExpression(op.ast(), left.ast(), right.ast()); },
  Exp0_xor(left: any, op: any, right: any) { return new BinaryExpression(op.ast(), left.ast(), right.ast()); },
  Exp1_binary(left: any, op: any, right: any) { return new BinaryExpression(op.ast(), left.ast(), right.ast()); },
  Exp2_binary(left: any, op: any, right: any) { return new BinaryExpression(op.ast(), left.ast(), right.ast()); },
  Exp3_binary(left: any, op: any, right: any) { return new BinaryExpression(op.ast(), left.ast(), right.ast()); },
  Exp4_binary(left: any, op: any, right: any) { return new BinaryExpression(op.ast(), left.ast(), right.ast()); },
  Exp5_not(op: any, operand: any) { return new UnaryExpression(op.ast(), operand.ast()); },
  Exp6_accessor(object: any, _1: any, property: any) { return new Accessor(object.ast(), property.ast()); },
  Exp7_parens(_1: any, expression: any, _2: any) { return expression.ast(); },
  VariableExpression(id: any) {
    return new IdentifierExpression(id.ast());
  },
  List(_1: any, values: any, _2: any) { return new ListExpression(values.ast()); },
  ListType(_1: any, type: any) { return new ListTypeExpression(type.ast()); },
  SumType(basicTypeOrId1: any, _1: any, basicTypeOrId2: any, _2: any, moreBasicTypeOrId: any) {
    return new SumTypeClass(basicTypeOrId1.ast(), basicTypeOrId2.ast(), moreBasicTypeOrId.ast());
  },
  FuncCall(callee: any, _1: any, args: any, _2: any) { return new FunctionCall(callee.ast(), args.ast()); },
  SubscriptExp(id: any, _1: any, expression: any, _2: any) {
    return new SubscriptedExpression(id.ast(), expression.ast());
  },
  NonemptyListOf(first: any, _: any, rest: any) {
    return [first.ast(), ...rest.ast()];
  },
  EmptyListOf() { return []; },
  varId(_1: any, _2: any) { return this.sourceString; },
  constId(_1: any, _2: any) { return this.sourceString; },
  FieldValue(id: any, _1: any, expression: any) { return new FieldValue(id.ast(), expression.ast()); },
  RecordLiteral(_1: any, fields: any, _2: any) { return new RecordLiteral(fields.ast()); },
  booleanLiteral(_: any) { return new BooleanLiteral(this.sourceString === 'true'); },
  numLiteral(_1: any, _2: any, _3: any) { return new NumericLiteral(+this.sourceString); },
  errLiteral(_: any) { return new ErrorLiteral(this.sourceString); },
  stringLiteral(_1: any, chars: any, _2: any) { return new StringLiteral(this.sourceString); },
  _terminal() { return this.sourceString; },
});

export function parse (text: string) {
  const match = grammar.match(withIndentsAndDedents(text));
  if (!match.succeeded()) {
    throw match.message;
  }

  return astGenerator(match).ast();
};
