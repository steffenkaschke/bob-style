import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild,
  SimpleChanges,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { InputTypes } from '../input/input.enum';
import { InputEventType } from '../form-elements.enum';
import { B_DATE_FORMATS, BDateAdapter } from './date.adapter';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { serverDateFormat } from '../../consts';
import { BaseFormElement } from '../base-form-element';
import { FormEvents } from '../form-elements.enum';
import {
  dateToString,
  stringyOrFail,
  stringToDate
} from '../../services/utils/transformers';
import { DateValue } from './datepicker.interface';
import {
  isDateISO8601,
  simpleUID,
  isDateFormat
} from '../../services/utils/functional-utils';

@Component({
  selector: 'b-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['../input/input.component.scss', './datepicker.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: BDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: B_DATE_FORMATS
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatepickerComponent extends BaseFormElement implements OnInit {
  @Input() displayFormat?: string;
  @Input() minDate?: Date | string;
  @Input() maxDate?: Date | string;

  public id = simpleUID('bdp-');
  public date: Date;

  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;
  readonly inputTypes = InputTypes;

  @ViewChild('input', { static: true }) input: ElementRef;
  @ViewChild('picker', { static: true }) picker: MatDatepicker<any>;

  @Output(FormEvents.dateChange) changed: EventEmitter<
    DateValue
  > = new EventEmitter<DateValue>();

  constructor(private cd: ChangeDetectorRef) {
    super();

    this.inputTransformers = [stringyOrFail, stringToDate];

    this.outputTransformers = [
      (date: Date): DateValue => ({
        date,
        value: dateToString(date, serverDateFormat),
        displayDate: dateToString(date, this.getDisplayFormat())
      })
    ];
    this.wrapEvent = false;
  }

  ngOnInit(): void {}

  // this extends BaseFormElement's ngOnChanges
  onNgChanges(changes: SimpleChanges): void {
    if (
      changes.displayFormat &&
      isDateFormat(changes.displayFormat.currentValue)
    ) {
      this.displayFormat = changes.displayFormat.currentValue;

      if (!changes.displayFormat.firstChange && this.date) {
        this.onDateChange(this.date);
      }
    }

    if (changes.minDate && isDateISO8601(changes.minDate.currentValue)) {
      this.minDate = stringToDate(changes.minDate.currentValue);
    }

    if (changes.maxDate && isDateISO8601(changes.maxDate.currentValue)) {
      this.maxDate = stringToDate(changes.maxDate.currentValue);
    }

    if (!this.placeholder && !(this.hideLabelOnFocus && this.label)) {
      this.placeholder = this.getDisplayFormat().toLowerCase();
    }
  }

  public onDateChange(value: Date) {
    if (value) {
      this.value = this.date = value;

      this.transmitValue(value, {
        eventType: [InputEventType.onBlur]
      });

      this.cd.detectChanges();
    }
  }

  private getDisplayFormat(): string {
    return this.displayFormat || BDateAdapter.bFormat || 'DD/MM/YYYY';
  }
}
