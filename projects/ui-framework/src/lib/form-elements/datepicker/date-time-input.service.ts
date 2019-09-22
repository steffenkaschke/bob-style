import { Injectable } from '@angular/core';
import { controlKeys, Keys } from '../../enums';
import { thisYear } from '../../services/utils/functional-utils';

@Injectable()
export class DateTimeInputService {
  public filterAllowedKeys(
    event: KeyboardEvent,
    allowedKeys = /[0-9,\W]/i
  ): KeyboardEvent {
    if (!event.metaKey) {
      event.stopPropagation();

      if (
        !allowedKeys.test(event.key) &&
        !controlKeys.includes(event.key as Keys)
      ) {
        event.preventDefault();
        return null;
      }
    }
    return event;
  }

  public parseDateInput(value: string, useChar = '/') {
    value = value
      .replace(/[a-zA-Z]+/g, '')
      .replace(/\W+/g, useChar)
      .replace(/(^\W+)/g, '');
    let valueSplit = value.split('/');

    if (valueSplit.length > 3) {
      valueSplit = valueSplit.slice(0, 3);
    }

    if (valueSplit.length === 1 && valueSplit[0].length > 2) {
      valueSplit = (
        valueSplit[0].slice(0, 4).replace(/(.{2})/g, '$1/') +
        valueSplit[0].slice(4)
      ).split('/');
    }

    if (valueSplit.length > 0 && parseInt(valueSplit[0], 10) > 31) {
      valueSplit[0] = '31';
    }

    if (valueSplit.length > 1 && parseInt(valueSplit[1], 10) > 12) {
      valueSplit[1] = '12';
    }

    valueSplit.forEach((v, i) => {
      if (
        i < 2 &&
        (v.length > 1 || valueSplit.length > i + 1) &&
        parseInt(v, 10) === 0
      ) {
        valueSplit[i] = '01';
      }
      if (i < valueSplit.length - 1 && v.length < 2) {
        valueSplit[i] = '0' + v;
      }
      if (
        i > 1 &&
        v.length > 3 &&
        (parseInt(v, 10) <= 1900 ||
          parseInt(v, 10) > thisYear() + 10 ||
          parseInt(v, 10) === 0)
      ) {
        valueSplit[i] = thisYear() + '';
      }
    });

    if (
      valueSplit.length < 3 &&
      valueSplit[valueSplit.length - 1].length === 2
    ) {
      valueSplit[valueSplit.length - 1] =
        valueSplit[valueSplit.length - 1] + '/';
    }

    return valueSplit.join('/');
  }
}
