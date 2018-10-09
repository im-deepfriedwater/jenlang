export class RecordLiteral {
  fields: any;

  constructor(fields: any) {
    this.fields = fields;
  }
  /* eslint-disable */
  analyze(context: any) {
    context.assertRecordNoDuplicateFields(this, 'Duplicate field names');
  }
  /* eslint-enable */

  optimize() {
    return this;
  }
};
