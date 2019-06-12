import { isArray, isString, stringListToArray } from './functional-utils';

export const booleanOrFail = value => {
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
  if (!isArray(value)) {
    throw new Error(
      `Value (${value}) must be an array, instead ${typeof value} was provided.`
    );
  }
  return value;
};

export const valueInArrayOrFail = (value, array) => {
  if (!value || !array) {
    return undefined;
  }
  if (!array.includes(value)) {
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
