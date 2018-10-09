export class Body {
  statements: any[]
  constructor(statements: any) {
    this.statements = statements;
  }

  analyze(context: any) {
    this.statements.forEach(s => s.analyze(context));
  }

  optimize() {
    this.statements.map(s => s.optimize()).filter(s => s !== null);
    return this;
  }
};
