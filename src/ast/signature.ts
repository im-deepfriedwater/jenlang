export class Signature {
  id: any;
  params: any;
  constructor(id: any, params: any) {
    Object.assign(this, { id, params });
  }
  /* eslint-disable class-methods-use-this */
  analyze() {
    // blank for now
  }

  optimize() {
    return this;
  }
};
