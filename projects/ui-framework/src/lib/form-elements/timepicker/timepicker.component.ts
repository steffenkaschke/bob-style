import {
  Component,
  forwardRef,
  ViewChild,
  AfterViewInit,
  ElementRef,
  Input,
  NgZone,
  ChangeDetectorRef
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { BaseFormElement } from '../base-form-element';
import { padWith0 } from '../../services/utils/functional-utils';

@Component({
  selector: 'b-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['../input/input.component.scss', './timepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true
    }
  ]
})
export class TimePickerComponent extends BaseFormElement
  implements AfterViewInit {
  constructor(
    private DOM: DOMhelpers,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {
    super();
  }
  @ViewChild('inputHours', { static: true }) inputHours: ElementRef;
  @ViewChild('inputMinutes', { static: true }) inputMinutes: ElementRef;

  valueHours: string;
  valueMinutes: string;

  ngAfterViewInit(): void {}

  filterKeys(event) {
    if (/[^0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  onHoursChange(event) {
    const value = String(this.getValue(event));

    if (value.length >= 2) {
      this.inputMinutes.nativeElement.focus();
    }
  }

  onMinutesChange(event) {
    const value = String(this.getValue(event));

    if (value.length >= 2) {
      this.inputMinutes.nativeElement.blur();
    }
  }

  onHoursBlur(event) {
    let value = this.getValue(event);

    if (value > 24) {
      value = 24;
    }

    this.valueHours = this.convertValue(value);
  }

  onMinutesBlur(event) {
    let value = this.getValue(event);

    if (value > 59) {
      value = 59;
    }

    this.valueMinutes = this.convertValue(value);
  }

  private getValue(event) {
    const value = parseInt(event.target.value, 10);
    return value !== value || value < 0 ? 0 : value;
  }

  private convertValue(val: number): string {
    return padWith0(val);
  }
}
