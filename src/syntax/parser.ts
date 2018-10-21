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
import { FunctionCall } from '../ast/function-call';
import { FunctionDeclaration } from '../ast/function-declaration';
import { Return } from '../ast/return';
import { TernaryExpression } from '../ast/ternary-expression';
import { ErrorLiteral } from '../ast/error-literal';
import { ForStatement } from '../ast/for-statement';
import { Case } from '../ast/case';
import { IfStatement } from '../ast/if-statement';
import { Accessor } from '../ast/accessor';
import { ListExpression } from '../ast/list';
import { ListTypeExpression } from '../ast/list-type';
import { TypeDeclaration } from '../ast/type-declaration';
import { SumTypeClass } from '../ast/sum-type';
import { FuncSignature } from '../ast/signature';
import { FuncAnnotation } from '../ast/annotation';
import { IdentifierExpression } from '../ast/identifier-expression';
import { Caller } from '../ast/caller';


// Credit to Ray Toal:
// Ohm turns `x?` into either [x] or [], which we should clean up for our AST.
const unpack = a => (a.length === 0 ? null : a[0]);

const grammar = ohm.grammar(fs.readFileSync('./syntax/jen.ohm'));
/* eslint-disable no-unused-vars */
const astGenerator = grammar.createSemantics().addOperation('ast', {
  Program(_1, body, _2) { return new Program(body.ast()); },
  Body(expressionsAndStatements) { return new Body(expressionsAndStatements.ast()); },
  Suite(_1, _2, body, _3) { return body.ast(); },
  /* eslint-disable no-undef */
  Conditional(_1, firstTest, _2, firstSuite, _3, moreTests, _4, moreSuites, _5, _6, lastSuite) {
    const tests = [firstTest.ast(), ...moreTests.ast()];
    const bodies = [firstSuite.ast(), ...moreSuites.ast()];
    const cases = tests.map((test, index) => new Case(test, bodies[index]));
    return new IfStatement(cases, unpack(lastSuite.ast()));
  },
  Statement_declaration(body, _) { return body.ast(); },
  Statement_assignment(body, _) { return body.ast(); },
  Statement_call(c, _) { return new Caller(c.ast()); },
  Statement_typedec(body, _) { return body.ast(); },
  Statement_return(returnStmt, _) { return returnStmt.ast(); },
  Statement_break(_1, _2) { return new BreakStatement(); },
  Statement_expression(body, _) { return body.ast(); },
  Declaration(ids, _, exps) { return new VarDec(ids.ast(), exps.ast()); },
  Assignment(ids, _, exps) { return new VarAsgn(ids.ast(), exps.ast()); },
  For(_1, ids, _2, exps, _3, suite) {
    return new ForStatement(ids.ast(), exps.ast(), suite.ast());
  },
  While(_1, exps, _2, suite) { return new WhileStatement(exps.ast(), suite.ast()); },
  TypeDec(_1, id, _2, sumType) { return new TypeDeclaration(id.ast(), sumType.ast()); },
  Return(_, e) { return new Return(e.ast()); },
  FuncDec(annotation, _1, signature, _2, suite) {
    return new FunctionDeclaration(annotation.ast(), signature.ast(), suite.ast());
  },
  Signature(id, _2, params, _3) { return new FuncSignature(id.ast(), params.ast()); },
  Annotation(id, _1, paramTypes, _2, resultTypes) {
    return new FuncAnnotation(id.ast(), paramTypes.ast(), resultTypes.ast());
  },
  Expression_ternary(conditional, _1, trueValue, _2, falseValue) {
    return new TernaryExpression(conditional.ast(), trueValue.ast(), falseValue.ast());
  },
  Exp0_and(left, op, right) { return new BinaryExpression(op.ast(), left.ast(), right.ast()); },
  Exp0_or(left, op, right) { return new BinaryExpression(op.ast(), left.ast(), right.ast()); },
  Exp0_xor(left, op, right) { return new BinaryExpression(op.ast(), left.ast(), right.ast()); },
  Exp1_binary(left, op, right) { return new BinaryExpression(op.ast(), left.ast(), right.ast()); },
  Exp2_binary(left, op, right) { return new BinaryExpression(op.ast(), left.ast(), right.ast()); },
  Exp3_binary(left, op, right) { return new BinaryExpression(op.ast(), left.ast(), right.ast()); },
  Exp4_binary(left, op, right) { return new BinaryExpression(op.ast(), left.ast(), right.ast()); },
  Exp5_not(op, operand) { return new UnaryExpression(op.ast(), operand.ast()); },
  Exp6_accessor(object, _1, property) { return new Accessor(object.ast(), property.ast()); },
  Exp7_parens(_1, expression, _2) { return expression.ast(); },
  VariableExpression(id) {
    return new IdentifierExpression(id.ast());
  },
  List(_1, values, _2) { return new ListExpression(values.ast()); },
  ListType(_1, type) { return new ListTypeExpression(type.ast()); },
  SumType(basicTypeOrId1, _1, basicTypeOrId2, _2, moreBasicTypeOrId) {
    return new SumTypeClass(basicTypeOrId1.ast(), basicTypeOrId2.ast(), moreBasicTypeOrId.ast());
  },
  FuncCall(callee, _1, args, _2) { return new FunctionCall(callee.ast(), args.ast()); },
  SubscriptExp(id, _1, expression, _2) {
    return new SubscriptedExpression(id.ast(), expression.ast());
  },
  NonemptyListOf(first, _, rest) {
    return [first.ast(), ...rest.ast()];
  },
  EmptyListOf() { return []; },
  varId(_1, _2) { return this.sourceString; },
  constId(_1, _2) { return this.sourceString; },
  FieldValue(id, _1, expression) { return new FieldValue(id.ast(), expression.ast()); },
  RecordLiteral(_1, fields, _2) { return new RecordLiteral(fields.ast()); },
  booleanLiteral(_) { return new BooleanLiteral(this.sourceString === 'true'); },
  numLiteral(_1, _2, _3) { return new NumericLiteral(+this.sourceString); },
  errLiteral(_) { return new ErrorLiteral(this.sourceString); },
  stringLiteral(_1, chars, _2) { return new StringLiteral(this.sourceString); },
  _terminal() { return this.sourceString; },
});

export (text) => {
  const match = grammar.match(withIndentsAndDedents(text));
  if (!match.succeeded()) {
    throw match.message;
  }

  return astGenerator(match).ast();
};
