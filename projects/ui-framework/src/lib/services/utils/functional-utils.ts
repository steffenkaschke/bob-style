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
