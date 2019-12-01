import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  SimpleChanges,
} from '@angular/core';
import { DOMInputEvent } from '../../types';
import { arrayMode } from '../../services/utils/functional-utils';
import { DateParseService, FormatParserResult } from './date-parse.service';

@Directive({
  selector: '[bDateInput]',
})
export class DateInputDirective {
  constructor(private inputRef: ElementRef) {
    this.input = inputRef.nativeElement;
  }

  private input: HTMLInputElement;
  private format: FormatParserResult;
  private date: Date = null;

  @Input('bDateInput') dateFortmat: string;

  @HostListener('input', ['$event']) onInput($event: DOMInputEvent) {
    // console.log('onInput');
    // this.parseInputValue();
  }

  @HostListener('change', ['$event']) onChange($event: DOMInputEvent) {
    console.log('onChange');

    this.parseInputValue();
  }

  ngOnInit() {
    // console.log(this.input.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dateFortmat) {
      // console.log('bDateInput dateFortmat', this.dateFortmat);

      this.format = DateParseService.prototype.parseFormat(this.dateFortmat);

      console.log('parsing format', this.format);

      this.input.placeholder = this.format.format;

      this.parseInputValue();
    }
  }

  parseInputValue() {
    // console.log('parseInputValue', this.format, this.dateFortmat);

    const parsed = DateParseService.prototype.parseDate(
      this.format || this.dateFortmat,
      this.input.value
    );

    this.input.style.borderColor = parsed.displayValue ? 'black' : 'red';

    this.input.value = parsed.displayValue || this.input.value;
    this.date = parsed.date || this.date;
  }
}
