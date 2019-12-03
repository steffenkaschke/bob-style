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
  isDate,
  applyChanges,
  hasChanges,
} from '../../../services/utils/functional-utils';
import isBefore from 'date-fns/isBefore';
import isAfter from 'date-fns/isAfter';
import isSameDay from 'date-fns/isSameDay';
import { DateParseResult, FormatParserResult } from '../datepicker.interface';
import { DOMInputEvent } from '../../../types';
import { DISPLAY_DATE_FORMAT_DEF } from '../../../consts';

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

  @Input('bDateInput') dateFortmat = DISPLAY_DATE_FORMAT_DEF;
  @Input() date: Date;
  @Input() min: Date;
  @Input() max: Date;

  @Output() parsed: EventEmitter<DateParseResult> = new EventEmitter<
    DateParseResult
  >();

  @HostListener('change', ['$event']) onChange($event: DOMInputEvent) {
    this.process();
  }

  ngOnChanges(changes: SimpleChanges) {
    applyChanges(
      this,
      changes,
      {
        dateFortmat: DISPLAY_DATE_FORMAT_DEF,
      },
      [],
      true
    );

    if (hasChanges(changes, ['dateFortmat'], true)) {
      this.format = this.parseService.parseFormat(this.dateFortmat);
      this.process();
    }

    if (hasChanges(changes, ['date']) && changes.date.currentValue !== '') {
      this.process(true);
    }

    if (hasChanges(changes, ['min', 'max'], true)) {
      this.process();
    }
  }

  ngOnInit() {
    if (!this.format && this.dateFortmat) {
      this.format = this.parseService.parseFormat(this.dateFortmat);
    }
  }

  process(useDate = false) {
    if (
      (!useDate && !this.input.value) ||
      (useDate &&
        ((!this.date && !this.lastDate) ||
          (this.date && this.lastDate && isSameDay(this.date, this.lastDate))))
    ) {
      return;
    }

    let parsed: DateParseResult = {
      valid: undefined,
      format: this.format ? this.format.format : null,
      date: null,
      value: null,
    };

    if (useDate) {
      parsed.date = this.date || null;

      parsed.value = this.parseService.getDisplayDate(this.format, this.date);
      parsed.valid = Boolean(parsed.value) || undefined;
    } else if (this.input.value) {
      parsed = this.parseService.parseDate(
        (this.format || this.dateFortmat) as any,
        this.input.value
      );
    }

    this.lastDate = parsed.date;

    if (
      parsed.valid &&
      ((isDate(this.min) && isBefore(parsed.date, this.min)) ||
        (isDate(this.max) && isAfter(parsed.date, this.max)))
    ) {
      parsed.valid = false;
    }

    this.parsed.emit(parsed);

    this.input.value = parsed.value;
    this.date = parsed.date;
  }
}
