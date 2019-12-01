import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';
import { LocaleFormat, DateLocaleFormatKeys } from '../../types';
import { LOCALE_FORMATS } from '../../consts';
import { get } from 'lodash';
import { format, parseISO } from 'date-fns';
import { DateParseService } from './date-parse.service';

const mockUser: {
  dateFormat: DateLocaleFormatKeys;
} = {
  dateFormat: 'DD-MMM-YYYY',
};

export const UserLocaleServiceMock = {
  dateFormat: mockUser.dateFormat.toUpperCase(),

  getDateFormat: () => {
    return UserLocaleServiceMock.dateFormat;
  },

  getDisplayDate: (date, localeFormat) => {
    let dateToFormat = date;

    const dateFormat = get(
      get(LOCALE_FORMATS, UserLocaleServiceMock.dateFormat),
      localeFormat
    );

    return format(
      typeof dateToFormat === 'string' ? parseISO(dateToFormat) : dateToFormat,
      dateFormat
    );
  },
};

@Injectable({
  providedIn: 'root',
})
export class BDateAdapterMock extends NativeDateAdapter {
  public static readonly monthFormat = 'MMM';
  public static readonly monthYearFormat = 'MMM yyyy';

  public static bFormat = get(
    get(LOCALE_FORMATS, UserLocaleServiceMock.dateFormat),
    LocaleFormat.FullDate
  );

  public static readonly bFormatParsed = DateParseService.prototype.parseFormat(
    get(
      get(LOCALE_FORMATS, UserLocaleServiceMock.dateFormat),
      LocaleFormat.FullDate
    )
  );

  parse(value: any): Date | null {
    console.log('----------------------');

    if (BDateAdapterMock.bFormatParsed.valid) {
      return DateParseService.prototype.parseDate(
        BDateAdapterMock.bFormatParsed,
        value
      ).date;
    }

    return null;
  }

  format(date: Date, displayFormat: any): string {
    switch (displayFormat) {
      case 'input':
        return UserLocaleServiceMock.getDisplayDate(
          date,
          LocaleFormat.FullDate
        );
      case 'inputMonth':
        return format(date, BDateAdapterMock.monthFormat);
      case 'monthYearFormat':
        return format(date, BDateAdapterMock.monthYearFormat);
      default:
        return date.toDateString();
    }
  }
}

export const B_DATE_FORMATS = {
  parse: {},
  display: {
    dateInput: 'input',
    monthYearLabel: 'monthYearFormat',
    dateA11yLabel: { day: 'numeric', month: 'long', year: 'numeric' },
    monthYearA11yLabel: { month: 'short', year: 'numeric' },
  },
};
