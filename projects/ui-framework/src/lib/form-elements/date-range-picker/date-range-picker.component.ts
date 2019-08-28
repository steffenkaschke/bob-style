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
import { B_DATE_FORMATS, BDateAdapter } from '../datepicker/date.adapter';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { serverDateFormat } from '../../consts';
import { BaseFormElement } from '../base-form-element';
import { FormEvents } from '../form-elements.enum';
import {
  dateToString,
  stringyOrFail,
  dateOrFail
} from '../../services/utils/transformers';
import { simpleUID } from '../../services/utils/functional-utils';
import { InputEvent } from '../input/input.interface';

@Component({
  selector: 'b-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: [
    '../input/input.component.scss',
    '../datepicker/datepicker.component.scss',
    './date-range-picker.component.scss'
  ],
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
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateRangePickerComponent extends BaseFormElement
  implements OnInit {
  @Input() value: Date | string;
  @Input() minDate?: Date | string;
  @Input() maxDate?: Date | string;
  @Input() dateFormat?: string;

  public id = simpleUID('bdp-');

  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;
  readonly inputTypes = InputTypes;

  @ViewChild('input', { static: true }) input: ElementRef;
  @ViewChild('picker', { static: true }) picker: MatDatepicker<any>;

  @Output(FormEvents.dateChange) changed: EventEmitter<
    InputEvent
  > = new EventEmitter<InputEvent>();

  constructor(private cd: ChangeDetectorRef) {
    super();

    this.inputTransformers = [stringyOrFail, dateOrFail];
    this.outputTransformers = [
      (value: Date): string => dateToString(value, serverDateFormat)
    ];
  }

  ngOnInit(): void {}

  // this extends BaseFormElement's ngOnChanges
  onNgChanges(changes: SimpleChanges): void {
    this.picker.close();

    if (changes.minDate) {
      this.minDate = dateOrFail(changes.minDate.currentValue);
    }

    if (changes.maxDate) {
      this.maxDate = dateOrFail(changes.maxDate.currentValue);
    }

    if (!this.placeholder && !(this.hideLabelOnFocus && this.label)) {
      this.placeholder = BDateAdapter.bFormat.toLowerCase();
    }
  }

  public onDateChange(value: Date) {
    if (value) {
      this.value = value;

      this.transmitValue(value, {
        eventType: [InputEventType.onBlur],
        addToEventObj: { date: value }
      });

      this.cd.detectChanges();
    }
  }
}
