import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild,
  SimpleChanges,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  NgZone
} from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { InputEventType } from '../form-elements.enum';
import { B_DATE_FORMATS, BDateAdapter } from './date.adapter';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { serverDateFormat } from '../../consts';
import { FormEvents } from '../form-elements.enum';
import {
  dateToString,
  stringyOrFail,
  dateOrFail
} from '../../services/utils/transformers';
import { InputEvent } from '../input/input.interface';
import { MobileService } from '../../services/utils/mobile.service';
import { BaseDatepickerElement } from './datepicker.abstract';

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
export class DatepickerComponent extends BaseDatepickerElement {
  constructor(
    mobileService: MobileService,
    cd: ChangeDetectorRef,
    zone: NgZone
  ) {
    super(mobileService, cd, zone);

    this.inputTransformers = [stringyOrFail, dateOrFail];

    this.outputTransformers = [
      (value: Date): string => dateToString(value, serverDateFormat)
    ];
  }

  @Input() value: Date | string;

  @ViewChild('input', { static: true }) input: ElementRef;
  @ViewChild('picker', { static: true }) picker: MatDatepicker<any>;

  @Output(FormEvents.dateChange) changed: EventEmitter<
    InputEvent
  > = new EventEmitter<InputEvent>();

  // this extends BaseDatepickerElement's onNgChanges
  onDatepickerChanges(changes: SimpleChanges): void {
    if (this.picker) {
      this.picker.close();
    }
  }

  public onDateChange(value: Date) {
    if (value) {
      this.value = value;

      this.transmitValue(value, {
        eventType: [InputEventType.onBlur],
        addToEventObj: { date: value }
      });
    }
  }
}
