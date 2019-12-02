import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { DOMInputEvent } from '../../../types';
import { DateParseService } from '../date-parse-service/date-parse.service';
import { isDate, applyChanges } from '../../../services/utils/functional-utils';
import isBefore from 'date-fns/isBefore';
import { isAfter } from 'date-fns';
import { DateParseResult, FormatParserResult } from '../datepicker.interface';

@Directive({
  selector: '[bDateInput]',
})
export class DateInputDirective implements OnChanges {
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

  @Input('bDateInput') dateFortmat: string;
  @Input() date: Date;
  @Input() min: Date;
  @Input() max: Date;

  @Output() parsed: EventEmitter<DateParseResult> = new EventEmitter<
    DateParseResult
  >();

  @HostListener('change', ['$event']) onChange($event: DOMInputEvent) {
    console.log('CHANGE event!');
    this.parseValue();
  }

  ngOnChanges(changes: SimpleChanges) {
    applyChanges(this, changes);

    if (changes.dateFortmat) {
      this.format = this.parseService.parseFormat(this.dateFortmat);
      this.parseValue();
    }

    if (changes.date) {
      console.log('onChanges date!');
      this.input.value = this.parseService.getDisplayDate(
        this.format,
        this.date
      );
    }
  }

  parseValue() {
    if (this.input.value) {
      const parsed = this.parseService.parseDate(
        (this.format || this.dateFortmat) as any,
        this.input.value
      );

      console.log('parseValue', parsed);

      if (
        parsed.valid &&
        ((isDate(this.min) && isBefore(parsed.date, this.min)) ||
          (isDate(this.max) && isAfter(parsed.date, this.max)))
      ) {
        parsed.valid = false;
      }

      this.parsed.emit(parsed);

      this.input.value = parsed.displayValue || this.input.value;
      this.date = parsed.date || this.date;
    }
  }
}
