#!/usr/bin/env node

/*
 *  Heavily inspired by Ray Toal's compiler for plainscript: https://github.com/rtoal/plainscript
 *
 * A jen Compiler
 *
 * This is a command line application that compiles a jen program from
 * a file. Synopsis:
 *
 * ./jen.ts -a <filename>
 *     writes out the AST and stops
 *
 * ./jen.ts -i <filename>
 *     writes the decorated AST then stops
 *
 * ./jen.ts <filename>
 *     compiles the jen program to Python, writing the generated
 *     Python code to standard output.
 *
 * ./jen.ts -o <filename>
 *     optimizes the intermediate code before generating target Python.
 *
 * Output of the AST and decorated AST uses the object inspection functionality
 * built into Node.js.
 */

import fs from 'fs';
import util from 'util';
import parse from './syntax/parser';
import './backend/python-generator';

const { argv } = require('yargs')
  .usage('$0 [-a] [-o] [-i] filename')
  .boolean(['a', 'o', 'i'])
  .describe('a', 'show abstract syntax tree after parsing then stop')
  .describe('o', 'do optimizations')
  .describe('i', 'generate and show the decorated abstract syntax tree then stop')
  .demand(1);

fs.readFile(argv._[0], 'utf-8', (err, text) => {
  if (err) {
    console.error(err); // eslint-disable-line no-console
    return;
  }
  let program = parse(text);
  if (argv.a) {
    console.log(util.inspect(program, { depth: null })); // eslint-disable-line no-console
    return;
  }
  program.analyze();
  if (argv.o) {
    program = program.optimize();
  }
  if (argv.i) {
    console.log(util.inspect(program, { depth: null })); // eslint-disable-line no-console
    return;
  }
  program.gen();
});

function f(x){
  return x;
}