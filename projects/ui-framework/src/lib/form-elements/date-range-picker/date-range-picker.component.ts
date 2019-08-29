import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  NgZone
} from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { B_DATE_FORMATS, BDateAdapter } from '../datepicker/date.adapter';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { serverDateFormat } from '../../consts';
import { FormEvents } from '../form-elements.enum';
import {
  dateToString,
  stringyOrFail,
  dateOrFail
} from '../../services/utils/transformers';
import { simpleUID } from '../../services/utils/functional-utils';
import { InputEvent } from '../input/input.interface';
import { BaseDatepickerElement } from '../datepicker/datepicker.abstract';
import { MobileService } from '../../services/utils/mobile.service';
import { DateTimeInputService } from '../datepicker/date-time-input.service';

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
  implements OnInit {
  @Input() value: Date | string;

  @Input() startDateLabel: string;
  @Input() endDateLabel: string;

  public idSD = simpleUID('bdp-sd-');
  public idED = simpleUID('bdp-ed-');

  public startDate: Date | string;
  public endDate: Date | string;

  // @ViewChild('input', { static: true }) input: ElementRef;
  // @ViewChild('picker', { static: true }) picker: MatDatepicker<any>;

  @Output(FormEvents.dateChange) changed: EventEmitter<
    InputEvent
  > = new EventEmitter<InputEvent>();

  constructor(
    mobileService: MobileService,
    cd: ChangeDetectorRef,
    zone: NgZone,
    dtInputSrvc: DateTimeInputService
  ) {
    super(mobileService, cd, zone, dtInputSrvc);

    this.inputTransformers = [stringyOrFail, dateOrFail];
    this.outputTransformers = [
      (value: Date): string => dateToString(value, serverDateFormat)
    ];
  }

  // this extends BaseDatepickerElement's onNgChanges
  onDatepickerChanges(changes: SimpleChanges): void {}

  public onStartDateChange(value: Date) {
    if (value) {
      this.startDate = value;
    }
  }

  public onEndDateChange(value: Date) {
    if (value) {
      this.endDate = value;
    }
  }
}
