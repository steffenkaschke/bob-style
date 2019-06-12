import {
  isArray,
  isString,
  stringListToArray,
  isObject,
  isNullOrUndefined,
  compareAsStrings
} from './functional-utils';

export const booleanOrFail = value => {
  if (isNullOrUndefined(value)) {
    return undefined;
  }
  if (typeof value !== 'boolean') {
    throw new Error(
      `Value (${value}) must be of type boolean, instead ${
        value === null ? 'null' : typeof value
      } was provided.`
    );
  }
  return value;
};

export const arrayOrFail = value => {
  if (isNullOrUndefined(value)) {
    return undefined;
  }
  if (!isArray(value)) {
    throw new Error(
      `Value (${value}) must be an array, instead ${typeof value} was provided.`
    );
  }
  return value;
};

export const objectHasKeyOrFail = (value: object, key: string) => {
  if (isNullOrUndefined(value)) {
    return undefined;
  }
  if (!key || !isObject(value) || !value.hasOwnProperty(key)) {
    throw new Error(
      `Value object (${value}) is not an object or has no key (${key}).`
    );
  }
  return value;
};

export const valueInArrayOrFail = (
  value: any,
  array: any[],
  key: string = null
) => {
  if (isNullOrUndefined(value) || isNullOrUndefined(array)) {
    return undefined;
  }
  if (
    (key && !array.find(i => i[key] === value[key])) ||
    !array.includes(value)
  ) {
    value = isString(value) ? value : JSON.stringify(value);
    array = array.map(i => (isString(i) ? i : JSON.stringify(i)));
    throw new Error(
      `Value (${value}) is not part of array (${array.join(', ')}).`
    );
  }
  return value;
};

export const truthyOrFalse = value => {
  const truthy = ['true', '1', 1, 'on', 'yes'];
  if (typeof value !== 'boolean') {
    value = truthy.includes(value) ? true : false;
  }
  return value;
};

export const arrayOfStringsOrArrayFromString = value =>
  isArray(value) ? value : isString(value) ? stringListToArray(value) : [];

export const valueToObjectWithKeyOfValueFromArray = (
  value: any,
  key: string,
  array: object[]
) => {
  if (isNullOrUndefined(value) || isNullOrUndefined(array)) {
    return undefined;
  }
  return array.find(i => compareAsStrings(i[key], value));
};
