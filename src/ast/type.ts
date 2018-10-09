interface TypeCache {
  [index: string]: Type
}

export class Type {  
  static cache: TypeCache = {};

  static BOOLEAN = new Type('boolean');
  static NUMBER = new Type('number');
  static ERROR = new Type('error');
  static STRING = new Type('string');
  static VOID = new Type('void');
  static ANY = new Type('any');

  name: any;
  
  constructor(name: string) {
    this.name = name;
    Type.cache[name] = this;
  }
  static ForName (name: string): Type{
    return Type.cache[name];
  }
  mustBeNumber(message: string) {
    return this.mustBeCompatibleWith(Type.NUMBER, message);
  }
  mustBeBoolean(message: string) {
    return this.mustBeCompatibleWith(Type.BOOLEAN, message);
  }
  mustBeString(message: string) {
    return this.mustBeCompatibleWith(Type.STRING, message);
  }
  mustBeError(message: string) {
    return this.mustBeCompatibleWith(Type.ERROR, message);
  }
  mustBeVoid(message: string) {
    return this.mustBeCompatibleWith(Type.VOID, message);
  }
  mustBeAny(message: string) {
    return this.mustBeCompatibleWith(Type.ANY, message);
  }
  mustBeCompatibleWith(otherType: any, message: string) {
    if (otherType !== Type.ANY && !this.isCompatibleWith(otherType)) {
      throw message;
    }
  }
  mustBeMutuallyCompatibleWith(otherType: any, message: string) {
    if (!(this.isCompatibleWith(otherType) || otherType.isCompatibleWith(this))) {
      throw message;
    }
  }
  isCompatibleWith(otherType: any): any{
    // If types is a field it is a sum type.
    // We'll defer to sum type to check for compatibility.
    if (otherType.types) {
      return otherType.isCompatibleWith(this);
    }
    // Likewise for list types.
    if (otherType.listType) {
      return otherType.isCompatibleWith(this);
    }

    return this === otherType || this === Type.ANY || otherType === Type.ANY;
  }
}