import {
  Component,
  forwardRef,
  ViewChild,
  AfterViewInit,
  ElementRef
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormElement } from '../base-form-element';
import { padWith0, isString } from '../../services/utils/functional-utils';
import { timeyOrFail } from '../../services/utils/transformers';
import { InputEvent } from '../../../../../../dist/ui-framework/bob-style';
import { InputEventType } from '../form-elements.enum';

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
  constructor() {
    super();
    this.inputTransformers = [
      timeyOrFail,
      (value: string) => {
        this.valueHours = this.splitValue(value, 0);
        this.valueMinutes = this.splitValue(value, 1);
        return value;
      }
    ];

    this.baseValue = '';
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

    if (value > 23) {
      value = 23;
    }

    this.valueHours = padWith0(value);
    this.transmit();
  }

  onMinutesBlur(event) {
    let value = this.getValue(event);

    if (value > 59) {
      value = 59;
    }

    this.valueMinutes = padWith0(value);
    this.transmit();
  }

  private transmit() {
    this.value = this.combineValue(this.valueHours, this.valueMinutes);
    this.transmitValue(this.value, { eventType: [InputEventType.onChange] });
  }

  private getValue(event: InputEvent): number {
    const value = parseInt(event.target.value, 10);
    return value !== value || value < 0 ? 0 : value;
  }

  private splitValue(value: string, index = 0): string {
    return isString(value) ? padWith0(value.split(':')[index]) : undefined;
  }

  private combineValue(valueHours: string, valueMinutes: string): string {
    return `${valueHours || '00'}:${valueMinutes || '00'}`;
  }
}
