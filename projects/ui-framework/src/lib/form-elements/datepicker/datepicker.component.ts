import {
  Component,
  forwardRef,
  Input,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  NgZone
} from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { B_DATE_FORMATS, BDateAdapter } from './date.adapter';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { serverDateFormat, serverDateFormatMonth } from '../../consts';
import { dateToString, dateOrFail } from '../../services/utils/transformers';
import { MobileService } from '../../services/utils/mobile.service';
import { BaseDatepickerElement } from './datepicker.abstract';
import { DateTimeInputService } from './date-time-input.service';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { WindowRef } from '../../services/utils/window-ref.service';
import { DatepickerType } from './datepicker.enum';

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

    this.inputTransformers = [dateOrFail];

    this.outputTransformers = [
      (value: Date): string =>
        dateToString(
          value,
          this.type === DatepickerType.month
            ? serverDateFormatMonth
            : serverDateFormat
        )
    ];

    this.baseValue = '';
  }

  @Input() value: Date | string = '';
}
