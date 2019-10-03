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
import { serverDateFormat } from '../../consts';
import { dateToString, dateOrFail } from '../../services/utils/transformers';
import { MobileService } from '../../services/utils/mobile.service';
import { BaseDatepickerElement } from './datepicker.abstract';
import { DateParseService } from './date-parse.service';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { WindowRef } from '../../services/utils/window-ref.service';
import { startOfMonth } from 'date-fns';
import { DatepickerType } from './datepicker.enum';
import { FormElementKeyboardCntrlService } from '../services/keyboard-cntrl.service';

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
    kbrdCntrlSrvc: FormElementKeyboardCntrlService,
    dateParseSrvc: DateParseService
  ) {
    super(
      windowRef,
      mobileService,
      DOM,
      cd,
      zone,
      kbrdCntrlSrvc,
      dateParseSrvc
    );

    this.inputTransformers = [dateOrFail];

    this.outputTransformers = [
      (value: Date): string =>
        value && this.type === DatepickerType.month
          ? dateToString(startOfMonth(value), serverDateFormat)
          : dateToString(value, serverDateFormat)
    ];

    this.baseValue = '';
  }

  @Input() value: Date | string = '';
}
