import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  NgZone
} from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
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
import { DateTimeInputService } from './date-time-input.service';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { WindowRef } from '../../services/utils/window-ref.service';

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
    windowRef: WindowRef,
    mobileService: MobileService,
    DOM: DOMhelpers,
    cd: ChangeDetectorRef,
    zone: NgZone,
    dtInputSrvc: DateTimeInputService
  ) {
    super(windowRef, mobileService, DOM, cd, zone, dtInputSrvc);

    this.inputTransformers = [stringyOrFail, dateOrFail];

    this.outputTransformers = [
      (value: Date): string => dateToString(value, serverDateFormat)
    ];
  }

  @Input() value: Date | string;

  @Output(FormEvents.dateChange) changed: EventEmitter<
    InputEvent
  > = new EventEmitter<InputEvent>();

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
