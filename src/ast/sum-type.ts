import { Type } from './type.js';
import { IdentifierExpression } from './identifier-expression.js';
import { Context } from '../semantics/context';

type TypeOrId = Type | IdentifierExpression;

export class SumType {
  types!: Type[];
  computedTypes!: Set<string | Type>;

  constructor(basicTypeOrId1: TypeOrId, basicTypeOrId2: TypeOrId, moreBasicTypesOrIds: TypeOrId[]) {
    Object.assign(this, {
      types: [basicTypeOrId1, basicTypeOrId2, ...moreBasicTypesOrIds],
    });
  }

  analyze(context: Context) {
    // Creates a mapping of each string representation of a type to the actual
    // type it is referencing. This allows for recursively checking through
    // sum types in the case of nested sum types.
    this.computedTypes = new Set();
    this.types.forEach((type: Type) => {
      const typeId = type instanceof IdentifierExpression ? type.id : type;
      this.computedTypes.add(typeId, Type.cache[typeId] || context.lookupSumType(typeId));
    });
    console.log('THIS', this.computedTypes);
  }

  isCompatibleWith(otherType: any) {
    return Object.keys(this.computedTypes)
      .some(typeKey => this.computedTypes[typeKey].isCompatibleWith(otherType));
  }

  mustBeCompatibleWith(otherType: any, message: any) {
    if (!this.isCompatibleWith(otherType)) {
      throw message;
    }
  }

  /* eslint-disable class-methods-use-this */
  optimize() {
    // Later we can implement an optimization step that further reduces sum types
    // to basic types.
  }
};
