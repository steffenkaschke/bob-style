export function MixIn(baseCtors: Function[]) {
  return function(derivedCtor: Function) {
    baseCtors.forEach(baseCtor => {
      const fieldCollector = {};
      baseCtor.apply(fieldCollector);
      Object.getOwnPropertyNames(fieldCollector).forEach(name => {
        derivedCtor.prototype[name] = fieldCollector[name];
      });

      Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
        if (name !== 'constructor') {
          derivedCtor.prototype[name] = baseCtor.prototype[name];
        }
      });
    });
  };
}

export const keysFromArrayOrObject = (smth: string[] | {}): string[] => {
  return Array.isArray(smth) ? smth : Object.keys(smth);
};

export const getKeyByValue = (object: object, value: any) => {
  return Object.keys(object).find(key => object[key] === value);
};

export const isString = (val: any): boolean => {
  return val && typeof val === 'string';
};

export const isArray = (val: any): boolean => {
  return val && Array.isArray(val);
};

export const isRenderedComponent = (obj: any): boolean => {
  return obj && !!obj.component;
};
