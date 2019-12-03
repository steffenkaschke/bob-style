export interface DateRangePickerValue {
  from: string;
  to: string;
}

export type DateFormatKeys = 'day' | 'month' | 'year';

export interface FormatParserResult {
  format: string;
  valid: boolean;
  items: number;
  separator: string;

  index: {
    day: number;
    month: number;
    year: number;
  };

  order: DateFormatKeys[];

  length: {
    day: number;
    month: number;
    year: number;
  };
}
export interface DateParseResult {
  valid: boolean;
  format: string;
  value: string;
  date: Date;
}
