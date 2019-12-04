import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
  OnChanges,
  OnInit,
} from '@angular/core';
import { DateParseService } from '../date-parse-service/date-parse.service';
import {
  applyChanges,
  hasChanges,
  isNullOrUndefined,
} from '../../../services/utils/functional-utils';
import { DateParseResult, FormatParserResult } from '../datepicker.interface';
import { DOMInputEvent, DateFormatFullDate } from '../../../types';
import { DISPLAY_DATE_FORMAT_DEF } from '../../../consts';
import { DateAdjust } from '../datepicker.enum';
import isBefore from 'date-fns/isBefore';
import isAfter from 'date-fns/isAfter';
import isSameDay from 'date-fns/isSameDay';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import addMilliseconds from 'date-fns/addMilliseconds';
import addMinutes from 'date-fns/addMinutes';
import toDate from 'date-fns/toDate';

@Directive({
  selector: '[bDateInput]',
})
export class DateInputDirective implements OnChanges, OnInit {
  constructor(
    private inputRef: ElementRef,
    private parseService: DateParseService
  ) {
    this.input = inputRef.nativeElement;

    if (this.input.nodeName !== 'INPUT') {
      throw new Error(`This directive should only be used on <input> element`);
    }
  }

  private input: HTMLInputElement;
  private format: FormatParserResult;
  private lastDate: Date;

  @Input('bDateInput')
  dateFormat: FormatParserResult | DateFormatFullDate = DISPLAY_DATE_FORMAT_DEF;
  @Input() date: Date;
  @Input() min: Date;
  @Input() max: Date;
  @Input() setTo: DateAdjust;

  @Output() parsed: EventEmitter<DateParseResult> = new EventEmitter<
    DateParseResult
  >();

  @HostListener('change', ['$event']) onChange($event: DOMInputEvent) {
    console.log($event.target.value);
    this.process();
  }

  ngOnChanges(changes: SimpleChanges) {
    applyChanges(
      this,
      changes,
      {
        dateFormat: DISPLAY_DATE_FORMAT_DEF,
      },
      [],
      true
    );

    if (hasChanges(changes, ['dateFormat'], true)) {
      console.log(
        'DIRECTIVE CHANGES FORMAT',
        this.dateFormat,
        isNullOrUndefined(this.date)
      );
      this.format = this.parseService.parseFormat(this.dateFormat as string);

      console.log('this.date', this.date);

      this.process(!isNullOrUndefined(this.date), true);
    }

    if (hasChanges(changes, ['date']) && changes.date.currentValue !== '') {
      console.log('hasChanges date');
      this.process(true);
    }

    if (hasChanges(changes, ['min', 'max'], true)) {
      this.process();
    }
  }

  ngOnInit() {
    if (!this.format && this.dateFormat) {
      this.format = this.parseService.parseFormat(this.dateFormat as string);
    }
  }

  process(useDate = false, force = false) {
    if (
      (!useDate && !this.input.value) ||
      (useDate &&
        ((!this.date && !this.lastDate) ||
          (!force && isSameDay(this.date, this.lastDate))))
    ) {
      console.log('same date');
      return;
    }

    let parsed: DateParseResult = {
      valid: false,
      format: this.format ? this.format.format : null,
      date: null,
      value: null,
    };

    if (useDate) {
      console.log('parsing date');
      parsed.date = this.date || null;
      parsed.value = this.parseService.getDisplayDate(this.format, parsed.date);
      parsed.valid = Boolean(parsed.value);

      // this.lastDate = this.date;
    } else if (this.input.value) {
      console.log('parsing input');
      parsed = this.parseService.parseDate(
        (this.format || this.dateFormat) as any,
        this.input.value
      );

      // this.lastDate = parsed.date;
    }

    if (isBefore(parsed.date, this.min) || isAfter(parsed.date, this.max)) {
      parsed.valid = false;
      parsed.value = null;
      parsed.date = null;
    }

    this.lastDate = this.date = parsed.date;

    this.input.value = parsed.value;

    parsed.date = this.getAdjustedDate(parsed.date);

    console.log('DIRECTIVE EMIT', parsed);

    this.parsed.emit(parsed);
  }

  private getAdjustedDate(date: Date) {
    return !date
      ? null
      : this.setTo === DateAdjust.startOfMonth
      ? startOfMonth(date)
      : this.setTo === DateAdjust.endOfMonth
      ? endOfMonth(date)
      : toDate(date);
  }
}
