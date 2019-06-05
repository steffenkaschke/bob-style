import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatDatepicker
} from '@angular/material';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { InputTypes } from '../input/input.enum';
import { B_DATE_FORMATS, BDateAdapter } from './date.adapter';
import { InputEvent } from '../input/input.interface';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { serverDateFormat } from '../../consts';
import { BaseInputElement } from '../base-input-element';
import { differenceInDays, format, isDate, isSameDay } from 'date-fns';

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
export class DatepickerComponent extends BaseInputElement
  implements OnInit, AfterViewInit {
  @Output() dateChange: EventEmitter<InputEvent> = new EventEmitter<
    InputEvent
  >();
  @Input() dateFormat?: string;

  public readonly calendarIcon: String = Icons.calendar;
  public readonly calendarIconSize: String = IconSize.medium;
  public readonly calendarIconColor: String = IconColor.dark;
  public readonly inputTypes = InputTypes;
  public initialized = false;

  @ViewChild('bInput') bInput: ElementRef;
  @ViewChild('picker') picker: MatDatepicker<any>;

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.dateFormat) {
      BDateAdapter.bFormat = this.dateFormat;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initialized = true;
    }, 200);
  }

  public checkDate(date: string): string {
    return isDate(date) ? format(date, serverDateFormat) : date;
  }

  public dateClass(date: Date): string {
    const today = new Date();
    const diff = differenceInDays(date, today);
    const same = isSameDay(today, date);
    return same ? 'today' : diff < 0 ? 'past' : 'future';
  }
}
