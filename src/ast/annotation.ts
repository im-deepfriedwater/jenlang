export class Annotation {
  constructor(id: any, paramTypes: any, resultTypes: any) {
    Object.assign(this, { id, paramTypes, resultTypes });
  }
  /* eslint-disable class-methods-use-this */
  analyze() {
    // blank for now
  }

  optimize() {
    return this;
  }
};
