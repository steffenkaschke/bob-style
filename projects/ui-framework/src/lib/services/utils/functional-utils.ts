import { SimpleChanges } from '@angular/core';

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

export const setPropsOnChanges = (
  propKeys: string[],
  changes: SimpleChanges,
  target: any
) => {
  for (const key of propKeys) {
    if (changes[key] && changes[key].currentValue !== target[key]) {
      target[key] = changes[key].currentValue;
    }
  }
};

export const randomFromArray = (array: any[], num: number = 1) =>
  array.sort(() => 0.5 - Math.random()).slice(0, num);

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

export const simpleUID = (
  prefix: string = '',
  length: number = 5,
  suffix: string = ''
): string => {
  return (
    prefix +
    Math.random()
      .toString(16)
      .substr(2, length) +
    suffix
  );
};

export const pass = (a: any): any => a;

export const isKey = (key: string, expected: string): boolean => {
  return key.toUpperCase() === expected.toUpperCase();
};

export const stringListToArray = (list: string): string[] => {
  if (isArray(list) || !list) {
    return list as any;
  }
  if (!isString(list)) {
    return [list];
  }
  return Array.from(
    new Set(list.split(/[^\w\u0020]+/).map(i => i.trim()))
  ).filter(i => !!i);
};

export const asArray = (smth: any): any[] => {
  return smth && (isArray(smth) ? smth : [smth]);
};
