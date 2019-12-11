import { Injectable } from '@angular/core';
import {
  thisYear,
  arrayMode,
  padWith0,
  thisMonth,
  thisDay,
  isDate,
  isNumber,
  isString,
  lastDayOfMonth,
  monthIndex,
} from '../../../services/utils/functional-utils';
import format from 'date-fns/format';
import {
  FormatParserResult,
  DateFormatKeys,
  DateParseResult,
} from '../datepicker.interface';
import { DateFormat } from '../../../types';

@Injectable()
export class DateParseService {
  parseFormat(
    frmt: string | DateFormat,
    monthlength = null
  ): FormatParserResult {
    if (!isString(frmt)) {
      return frmt as any;
    }

    const result: Partial<FormatParserResult> = {
      format: frmt.trim().replace(/\s+/g, ' ') as DateFormat,
      valid: false,
      items: 0,
      length: {
        day: 0,
        month: 0,
        year: 0,
      },
      index: {
        day: null,
        month: null,
        year: null,
      },
      onlyMonth: false,
    };

    result.separator = arrayMode<string>(result.format.match(/\W/g)) || '/';

    const split: string[] = result.format
      .toLowerCase()
      .split(/\W+/g)
      .filter(Boolean)
      .slice(0, 3);

    result.items = split.length;

    result.index.day = split.findIndex(i => i === 'dd' || i === 'd');
    result.index.month = split.findIndex(i => i.includes('mm'));
    result.index.year = split.findIndex(i => i.includes('yy'));

    result.length.day =
      result.index.day > -1 ? split[result.index.day].length : 0;
    result.length.month =
      result.index.month > -1 ? split[result.index.month].length : 0;
    result.length.year =
      result.index.year > -1
        ? isNumber(monthlength)
          ? monthlength
          : split[result.index.year].length
        : 0;

    if (result.length.year) {
      split[result.index.year] = 'y'.repeat(result.length.year);
    }

    if (result.index.month > -1) {
      split[result.index.month] = split[result.index.month].toUpperCase();
    }

    if (!result.length.day) {
      result.onlyMonth = true;
    }

    result.valid =
      result.items &&
      [result.index.day, result.index.month, result.index.year].filter(
        i => i > -1
      ).length === result.items;

    if (!result.valid) {
      return result as FormatParserResult;
    }

    let cntr = 0;
    ['day', 'month', 'year'].forEach(i => {
      if (result.index[i] > -1) {
        return;
      }
      result.index[i] = result.items + cntr;
      cntr++;
    });

    result.order = (['day', 'month', 'year'] as DateFormatKeys[]).sort(
      (a, b) => {
        return result.index[a] - result.index[b];
      }
    );

    result.format = split.join(result.separator) as DateFormat;

    return result as FormatParserResult;
  }

  parseDate(
    frmt: Partial<FormatParserResult>,
    value: string,
    strict = false
  ): DateParseResult {
    console.log('------------------------');
    console.log('value:', value, 'format:', frmt);

    if (isString(frmt)) {
      frmt = this.parseFormat(frmt as any);
    }

    const resultValue = [],
      result: Partial<DateParseResult> = {
        valid: false,
        format: frmt.format,
        value: null,
        date: null,
      },
      index = {
        day: null,
        month: null,
        year: null,
      };

    let resultItems = 0,
      onlyDay = false,
      onlyMonth = false,
      onlyYear = false;

    if (isNumber(value)) {
      result.valid = true;
      result.date = new Date(value);
    }

    if (!isString(value) || !frmt.valid) {
      return result as DateParseResult;
    }

    value = value.trim().replace(/\s+/g, ' ');
    let split: string[] = value.split(/\W+/g).filter(Boolean);

    resultItems = split.length;

    if (
      resultItems === 1 &&
      value.length > 4 &&
      frmt.length.month < 3 &&
      !/\D/g.test(value)
    ) {
      console.log('no separator split');

      let curInd = 0;

      frmt.order.forEach((key, indx) => {
        split[indx] = value.slice(
          curInd,
          indx < 2 ? curInd + frmt.length[key] : undefined
        );
        curInd = curInd + frmt.length[key];
      });

      split = split.filter(Boolean);
      resultItems = split.length;
    }

    console.log(split, resultItems);

    if (!resultItems || (strict && resultItems < frmt.items)) {
      return result as DateParseResult;
    }

    if (strict) {
      split = split.slice(0, frmt.items);
      resultItems = split.length;
    }

    index.day = split.findIndex(i => Number(i) > 12 && Number(i) < 32);
    index.month = split.findIndex(i => isNaN(Number(i)));
    index.year = split.findIndex(
      i => Number(i) > 31 && ((strict && i.length > 2) || !strict)
    );

    console.log(
      'index.day',
      index.day,
      'index.month',
      index.month,
      'index.year',
      index.year
    );

    onlyYear =
      (frmt.items === 1 && frmt.index.year === 0) ||
      (resultItems === 1 && index.year > -1);

    onlyDay =
      resultItems === 1 &&
      !onlyYear &&
      (index.day > -1 ||
        (index.day === -1 &&
          index.month === -1 &&
          frmt.index.day > frmt.items));

    onlyMonth =
      (frmt.onlyMonth && !onlyYear) ||
      (frmt.items === 1 && frmt.index.month === 0 && !onlyYear) ||
      (resultItems === 1 &&
        !onlyYear &&
        !onlyDay &&
        frmt.index.month < frmt.index.day) ||
      (resultItems === 2 && index.year > -1 && index.day < 0);

    console.log(
      'onlyDay',
      onlyDay,
      'onlyMonth',
      onlyMonth,
      'onlyYear',
      onlyYear
    );

    let needIndex = frmt.order.filter(k => index[k] < 0);
    const indexes = Object.values(index),
      extraIndexes = [0, 1, 2].filter(i => !indexes.includes(i)),
      needOrderDay = needIndex.findIndex(i => i === 'day'),
      needOrderMonth = needIndex.findIndex(i => i === 'month');

    if (
      needIndex.includes('year') &&
      needIndex[needIndex.length - 1] !== 'year'
    ) {
      needIndex = needIndex.filter(i => i !== 'year');
      needIndex.push('year');
    }

    if (
      (resultItems === 1 &&
        needIndex.includes('day') &&
        needIndex.includes('month') &&
        !onlyMonth &&
        needOrderDay > needOrderMonth) ||
      (resultItems === 2 &&
        onlyMonth &&
        needOrderDay > -1 &&
        needOrderDay < needOrderMonth)
    ) {
      needIndex[needOrderDay] = 'month';
      needIndex[needOrderMonth] = 'day';
    }

    needIndex.forEach((itm, idx) => {
      index[itm] = extraIndexes[idx];
    });

    // parsed result

    resultValue[frmt.index.day] =
      onlyMonth || onlyYear
        ? '01'
        : padWith0(split[index.day], 2) || thisDay(frmt.length.day === 2) + '';

    resultValue[frmt.index.month] =
      onlyYear && !onlyMonth
        ? '01'
        : padWith0(split[index.month], 2) ||
          thisMonth(frmt.length.month === 2) + '';

    resultValue[frmt.index.year] =
      split[index.year] &&
      ((split[index.year].length < 3 && Number(split[index.year]) > 30) ||
        (split[index.year].length === 4 &&
          Math.abs(thisYear() - Number(split[index.year])) < 110))
        ? split[index.year]
        : (thisYear() + '').slice(4 - (frmt.length.year || 4));

    const lastDay = lastDayOfMonth(
      monthIndex(resultValue[frmt.index.month]),
      Number(resultValue[frmt.index.year])
    );

    if (Number(resultValue[frmt.index.day]) > lastDay) {
      resultValue[frmt.index.day] = lastDay + '';
    }

    // assembling final result

    result.value = resultValue.join(frmt.separator);

    console.log(
      'result.value',
      result.value,
      monthIndex(resultValue[frmt.index.month])
    );

    result.date = new Date(
      Number(resultValue[frmt.index.year]),
      monthIndex(resultValue[frmt.index.month]),
      Number(resultValue[frmt.index.day])
    );

    result.date = isDate(result.date) ? result.date : null;
    result.valid = result.date !== null;
    result.value = (result.valid && format(result.date, frmt.format)) || null;

    return result as DateParseResult;
  }

  getDisplayDate(frmt: Partial<FormatParserResult>, date: Date): string {
    if (!frmt || !frmt.valid || !isDate(date)) {
      return null;
    }
    const displayDate = format(date, frmt.format);
    return !displayDate.toLowerCase().includes('invalid') ? displayDate : null;
  }
}
