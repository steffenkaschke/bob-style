import {
  Component,
  forwardRef,
  Input,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  NgZone,
  AfterViewInit
} from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { B_DATE_FORMATS, BDateAdapter } from '../datepicker/date.adapter';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { serverDateFormat } from '../../consts';
import {
  dateToString,
  dateOrFail,
  objectHasKeyOrFail
} from '../../services/utils/transformers';
import { simpleUID } from '../../services/utils/functional-utils';
import { BaseDatepickerElement } from '../datepicker/datepicker.abstract';
import { MobileService } from '../../services/utils/mobile.service';
import { DateTimeInputService } from '../datepicker/date-time-input.service';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { WindowRef } from '../../services/utils/window-ref.service';
import { DateRangePickerValue } from './date-range-picker.interface';

interface DateRangePickerValueLocal {
  startDate: Date | string;
  endDate: Date | string;
}

const valueDef: DateRangePickerValueLocal = {
  startDate: undefined,
  endDate: undefined
};

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
export class DateRangePickerComponent extends BaseDatepickerElement
  implements AfterViewInit {
  constructor(
    windowRef: WindowRef,
    mobileService: MobileService,
    DOM: DOMhelpers,
    cd: ChangeDetectorRef,
    zone: NgZone,
    dtInputSrvc: DateTimeInputService
  ) {
    super(windowRef, mobileService, DOM, cd, zone, dtInputSrvc);

    this.inputTransformers = [
      objectHasKeyOrFail(['from', 'to'], true),
      (value: DateRangePickerValue): DateRangePickerValueLocal => {
        return value
          ? {
              startDate: dateOrFail(value.from),
              endDate: dateOrFail(value.to)
            }
          : valueDef;
      }
    ];

    this.outputTransformers = [
      (value: DateRangePickerValueLocal): DateRangePickerValue => {
        return {
          from: dateToString(value.startDate, serverDateFormat),
          to: dateToString(value.endDate, serverDateFormat)
        };
      }
    ];

    this.baseValue = valueDef;
  }

  @Input() value: DateRangePickerValueLocal = valueDef;

  @Input() startDateLabel: string;
  @Input() endDateLabel: string;

  public idSD = simpleUID('bdp-sd-');
  public idED = simpleUID('bdp-ed-');

  ngAfterViewInit(): void {
    this.overlayStylesDef = {
      '--start-date-label': '"' + this.startDateLabel || this.label + '\'',
      '--end-date-label':
        '"' + this.endDateLabel || this.startDateLabel || this.label + '\''
    };
  }

  public getDateClass = (date: Date): string => {
    if (date) {
      const d = date.getTime();
      const ds =
        this.value.startDate && (this.value.startDate as Date).getTime();
      const de = this.value.endDate && (this.value.endDate as Date).getTime();

      return d > ds && d < de
        ? 'in-range'
        : d === ds
        ? 'in-range first-in-range'
        : d === de
        ? 'in-range last-in-range'
        : undefined;
    }
  }
}
