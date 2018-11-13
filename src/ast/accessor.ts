import { Type } from "./type";
import { ListType } from "./list-type";

export class Accessor {
  object: any;
  property: any;
  type: any;

  constructor(object: Object, property: Object) {
    
    this.object = object;
    this.property = property;
  }

  analyze(context: any) {
    this.object.analyze(context);
    // TODO move this into a less hard coded solution.
    if (this.property === 'length') {
      if (!(this.object.type instanceof ListType)) {
        throw new Error('Length property used on non-list type');
      }
      this.type = Type.NUMBER;
    }
  }

  optimize() {
    this.object = this.object.optimize();
    this.property = this.property.optimize();
    return this;
  }
  // Depends on the generator, as such will be filled in later.
  gen() { }
};
