import { NativeDateAdapter } from '@angular/material/core';
import { format } from 'date-fns';

export class BDateAdapter extends NativeDateAdapter {
  public static bFormat = 'DD/MM/YYYY';
  public static readonly monthFormat = 'MMM';

  parse(value: any): Date | null {
    if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
      const str = value.split('/');
      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);
      return new Date(year, month, date);
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }
  format(date: Date, displayFormat: any): string {
    switch (displayFormat) {
      case 'input':
        return format(date, BDateAdapter.bFormat);
      case 'inputMonth':
        return format(date, BDateAdapter.monthFormat);
      default:
        return date.toDateString();
    }
  }
}

export const B_DATE_FORMATS = {
    parse: {
      dateInput: {month: 'short', year: 'numeric', day: 'numeric'}
    },
    display: {
      dateInput: 'input',
      monthYearLabel: 'inputMonth',
      dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
      monthYearA11yLabel: {year: 'numeric', month: 'long'},
    }
  };
