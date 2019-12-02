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
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import {
  FormatParserResult,
  DateFormatKeys,
  DateParseResult,
} from '../datepicker.interface';

@Injectable()
export class DateParseService {
  parseFormat(frmt: string): FormatParserResult {
    const result: Partial<FormatParserResult> = {
      format: frmt.trim().replace(/\s+/g, ' '),
      valid: false,
      example: null,
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
      result.index.year > -1 ? split[result.index.year].length : 0;

    if (result.index.month > -1) {
      split[result.index.month] = split[result.index.month].toUpperCase();
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

    result.format = split.join(result.separator);

    result.example = format(new Date(), result.format);

    return result as FormatParserResult;
  }

  parseDate(
    frmt: Partial<FormatParserResult>,
    value: string,
    strict = false
  ): DateParseResult {
    if (isString(frmt)) {
      frmt = this.parseFormat(frmt as any);
    }

    const resultValue = [],
      result: Partial<DateParseResult> = {
        valid: false,
        format: frmt.format,
        value: value,
        date: null,
        displayValue: null,
      },
      index = {
        day: null,
        month: null,
        year: null,
      };

    let resultItems = 0,
      resultFormat = [],
      onlyDay = false,
      onlyMonth = false,
      onlyYear = false;

    if (isNumber(value)) {
      result.valid = true;
      result.date = new Date(value);
    }

    if (!isString(value)) {
      return result as DateParseResult;
    }

    let split: string[] = value
      .trim()
      .replace(/\s+/g, ' ')
      .split(/\W+/g)
      .filter(Boolean);

    resultItems = split.length;

    if (!resultItems || (strict && resultItems < frmt.items)) {
      return result as DateParseResult;
    }

    if (strict) {
      split = split.slice(0, frmt.items);
      resultItems = split.length;
    }

    console.log('1 split', split);

    index.day = split.findIndex(
      i => parseInt(i, 10) > 12 && parseInt(i, 10) < 32
    );
    index.month = split.findIndex(i => isNaN(parseInt(i, 10)));
    index.year = split.findIndex(i => parseInt(i, 10) > 31 && i.length > 2);

    console.log('2 index', index);

    onlyYear =
      (frmt.items === 1 && frmt.index.year === 0) ||
      (resultItems === 1 && index.year > -1);

    onlyDay =
      resultItems === 1 &&
      !onlyYear && //frmt.
      (index.day > -1 || (index.day === -1 && index.month === -1));

    onlyMonth =
      (frmt.items === 1 && frmt.index.month === 0) ||
      (resultItems === 1 && !onlyYear && !onlyDay) ||
      (resultItems === 2 && index.year > -1);

    console.log(
      '3 onlyDay',
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

    console.log('4-A needIndex', needIndex, 'extraIndexes', extraIndexes);

    if (
      needIndex.includes('year') &&
      needIndex[needIndex.length - 1] !== 'year'
    ) {
      needIndex = needIndex.filter(i => i !== 'year');
      needIndex.push('year');
    }

    console.log('4-B needIndex', needIndex, 'extraIndexes', extraIndexes);

    if (
      (resultItems === 1 &&
        needIndex.includes('day') &&
        needIndex.includes('month') &&
        !onlyMonth &&
        needOrderDay > needOrderMonth) ||
      (resultItems === 2 && onlyMonth && needOrderDay < needOrderMonth)
    ) {
      needIndex[needOrderDay] = 'month';
      needIndex[needOrderMonth] = 'day';
    }

    needIndex.forEach((itm, idx) => {
      index[itm] = extraIndexes[idx];
    });

    console.log('5 needIndex', needIndex);
    console.log('6 index', index);

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
      ((split[index.year].length < 3 && parseInt(split[index.year], 10) > 30) ||
        (split[index.year].length === 4 &&
          Math.abs(thisYear() - parseInt(split[index.year], 10)) < 110))
        ? split[index.year]
        : (thisYear() + '').slice(4 - (frmt.length.year || 4));

    const lastDay = lastDayOfMonth(
      monthIndex(resultValue[frmt.index.month]),
      parseInt(resultValue[frmt.index.year], 10)
    );

    if (parseInt(resultValue[frmt.index.day], 10) > lastDay) {
      resultValue[frmt.index.day] = lastDay + '';
    }

    // adjust format

    resultFormat[frmt.index.day] = 'd'.repeat(frmt.length.day);
    resultFormat[frmt.index.month] = 'M'.repeat(frmt.length.month);
    resultFormat[frmt.index.year] = 'y'.repeat(frmt.length.year);
    resultFormat = resultFormat.filter(Boolean);

    if (
      parseInt(resultValue[frmt.index.month], 10) > 0 &&
      frmt.length.month > 2
    ) {
      resultFormat[frmt.index.month] = 'M'.repeat(2);
    }
    if (
      frmt.length.year &&
      resultValue[frmt.index.year].length > frmt.length.year
    ) {
      resultFormat[frmt.index.year] = 'y'.repeat(
        resultValue[frmt.index.year].length
      );
    }

    // assembling result

    result.value = resultValue.join(frmt.separator);
    result.format = resultFormat.join(frmt.separator);

    // getting date

    result.date = new Date(
      parseInt(resultValue[frmt.index.year], 10),
      monthIndex(resultValue[frmt.index.month]),
      parseInt(resultValue[frmt.index.day], 10)
    );

    result.date = isDate(result.date)
      ? result.date
      : parse(result.value, result.format, new Date());

    // final result

    result.date = isDate(result.date) ? result.date : null;

    result.valid = result.date !== null;

    result.displayValue =
      (result.valid && format(result.date, frmt.format)) || null;

    return result as DateParseResult;
  }

  getDisplayDate(frmt: Partial<FormatParserResult>, date: Date): string {
    if (!frmt.valid || !isDate(date)) {
      return null;
    }
    return format(date, frmt.format);
  }
}
