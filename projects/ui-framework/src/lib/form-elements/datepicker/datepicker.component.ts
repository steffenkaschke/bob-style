import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild,
  SimpleChanges
} from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatDatepicker
} from '@angular/material';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { InputTypes } from '../input/input.enum';
import { InputEventType } from '../form-elements.enum';
import { B_DATE_FORMATS, BDateAdapter } from './date.adapter';
import { InputEvent } from '../input/input.interface';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { serverDateFormat } from '../../consts';
import { differenceInDays, format, isDate, isSameDay } from 'date-fns';
import { BaseFormElement } from '../base-form-element';
import { FormEvents } from '../form-elements.enum';

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
  ]
})
export class DatepickerComponent extends BaseFormElement implements OnInit {
  @Input() dateFormat?: string;
  public date: Date;

  public readonly calendarIcon: String = Icons.calendar;
  public readonly calendarIconSize: String = IconSize.medium;
  public readonly calendarIconColor: String = IconColor.dark;
  public readonly inputTypes = InputTypes;

  @ViewChild('bInput') bInput: ElementRef;
  @ViewChild('picker') picker: MatDatepicker<any>;

  public outputEventName = FormEvents.dateChange;
  @Output() dateChange: EventEmitter<InputEvent> = new EventEmitter<
    InputEvent
  >();

  constructor() {
    super();
    this.outputTransformers = [
      date => {
        return isDate(date)
          ? format(
              date,
              (!!this.dateFormat && this.dateFormat) || serverDateFormat
            )
          : date;
      }
    ];
  }

  ngOnInit(): void {
    if (this.dateFormat) {
      BDateAdapter.bFormat = this.dateFormat.toUpperCase();
    }
  }

  // this extends BaseFormElement's ngOnChanges
  onNgChanges(changes: SimpleChanges): void {
    if (changes.dateFormat && !changes.dateFormat.firstChange) {
      this.dateFormat = changes.dateFormat.currentValue.toUpperCase();
      BDateAdapter.bFormat =
        (!!this.dateFormat && this.dateFormat) || 'DD/MM/YYYY';

      if (this.date) {
        this.onDateChange(this.date);
      }
    }
  }

  public onDateChange(value: Date) {
    if (value) {
      this.value = this.date = value;

      this.transmitValue(value, {
        eventType: [InputEventType.onChange, InputEventType.onBlur]
      });
    }
  }

  public dateClass(date: Date): string {
    const today = new Date();
    const diff = differenceInDays(date, today);
    const same = isSameDay(today, date);
    return same ? 'today' : diff < 0 ? 'past' : 'future';
  }
}
