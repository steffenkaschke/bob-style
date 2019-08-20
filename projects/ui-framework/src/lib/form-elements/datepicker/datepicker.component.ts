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
} from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { InputTypes, InputAutoCompleteOptions } from '../input/input.enum';
import { InputEventType } from '../form-elements.enum';
import { B_DATE_FORMATS, BDateAdapter } from './date.adapter';
import { InputEvent } from '../input/input.interface';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { serverDateFormat } from '../../consts';
import { BaseFormElement } from '../base-form-element';
import { FormEvents } from '../form-elements.enum';
import {
  dateyOrFail,
  dateToString,
  stringyOrFail
} from '../../services/utils/transformers';

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
export class DatepickerComponent extends BaseFormElement
  implements OnInit {
  // tslint:disable-next-line: no-input-rename
  @Input('inputLabel') label: string;
  @Input() dateFormat?: string;
  @Input() enableBrowserAutoComplete: InputAutoCompleteOptions =
    InputAutoCompleteOptions.off;
  public date: Date;

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
    this.inputTransformers = [stringyOrFail, dateyOrFail];
    this.outputTransformers = [
      date =>
        dateToString(
          date,
          (!!this.dateFormat && this.dateFormat) || serverDateFormat
        )
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
        eventType: [InputEventType.onChange],
        addToEventObj: { date: this.date }
      });

      this.cd.detectChanges();
    }
  }

  // public dateClass(date: Date): string {
  //   const today = new Date();
  //   const diff = differenceInDays(date, today);
  //   const same = isSameDay(today, date);
  //   return same ? 'today' : diff < 0 ? 'past' : 'future';
  // }
}
