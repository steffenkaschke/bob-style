export interface DateValue {
  value: string; // ISO 8601
  displayDate?: string;
  date?: Date;
}

export interface DateRangeValue {
  startDate: DateValue;
  endDate: DateValue;
}
