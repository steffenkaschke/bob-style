import {
  Component,
  forwardRef,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormElement } from '../base-form-element';
import {
  padWith0,
  isString,
  isKey,
  isNumber
} from '../../services/utils/functional-utils';
import { timeyOrFail } from '../../services/utils/transformers';
import { InputEventType } from '../form-elements.enum';
import { Keys } from '../../enums';
import { Icons, IconSize, IconColor } from '../../icons/icons.enum';

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
export class TimePickerComponent extends BaseFormElement {
  constructor(private cd: ChangeDetectorRef) {
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
  hoursFocused = false;
  minutesFocused = false;

  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;

  onInputKeydown(event: KeyboardEvent) {
    event.stopPropagation();
    const allowedKeys = [
      Keys.enter,
      Keys.escape,
      Keys.tab,
      Keys.delete,
      Keys.backspace,
      Keys.arrowleft,
      Keys.arrowright,
      Keys.arrowup,
      Keys.arrowdown
    ];
    if (/[^0-9]/.test(event.key) && !allowedKeys.includes(event.key as Keys)) {
      event.preventDefault();
      return;
    }
    if (isKey(event.key, Keys.arrowright)) {
      if (
        this.hoursFocused &&
        this.inputHours.nativeElement.selectionStart >=
          this.inputHours.nativeElement.value.length
      ) {
        event.preventDefault();
        this.switchInputs();
      }
    }
    if (isKey(event.key, Keys.arrowleft)) {
      if (
        this.minutesFocused &&
        this.inputMinutes.nativeElement.selectionStart === 0
      ) {
        event.preventDefault();
        this.switchInputs();
      }
    }
    if (isKey(event.key, Keys.arrowup)) {
      event.preventDefault();
      if (this.hoursFocused) {
        this.inputHours.nativeElement.value = this.parseValue(
          this.inputHours.nativeElement.value,
          1,
          0,
          23,
          '00'
        );
        if (this.inputHours.nativeElement.value === '23') {
          this.switchInputs();
        } else {
          this.inputHours.nativeElement.setSelectionRange(2, 2);
        }
      }
      if (this.minutesFocused) {
        this.inputMinutes.nativeElement.value = this.parseValue(
          this.inputMinutes.nativeElement.value,
          1,
          0,
          59,
          '00'
        );
        this.inputMinutes.nativeElement.setSelectionRange(2, 2);
      }
    }
    if (isKey(event.key, Keys.arrowdown)) {
      event.preventDefault();
      if (this.hoursFocused) {
        this.inputHours.nativeElement.value = this.parseValue(
          this.inputHours.nativeElement.value,
          -1,
          0,
          23,
          '00'
        );
        this.inputHours.nativeElement.setSelectionRange(2, 2);
      }
      if (this.minutesFocused) {
        this.inputMinutes.nativeElement.value = this.parseValue(
          this.inputMinutes.nativeElement.value,
          -1,
          0,
          59,
          '00'
        );
        if (this.inputMinutes.nativeElement.value === '00') {
          this.switchInputs();
        } else {
          this.inputMinutes.nativeElement.setSelectionRange(2, 2);
        }
      }
    }
  }

  onHoursChange(event) {
    if (event.target.value.length > 1) {
      this.inputMinutes.nativeElement.focus();
    }
  }

  onMinutesChange(event) {
    if (event.target.value.length > 1) {
      this.inputMinutes.nativeElement.blur();
    }
  }

  onHoursFocus() {
    this.hoursFocused = true;
    this.minutesFocused = false;
    this.inputHours.nativeElement.select();
    this.cd.detectChanges();
  }

  onMinutesFocus() {
    this.minutesFocused = true;
    this.hoursFocused = false;
    this.inputMinutes.nativeElement.select();
    this.cd.detectChanges();
  }

  onHoursBlur(event: FocusEvent) {
    this.hoursFocused = false;
    this.inputHours.nativeElement.value = this.valueHours = this.parseValue(
      (event.target as HTMLInputElement).value,
      0,
      0,
      23,
      ''
    );
    this.transmit();
  }

  onMinutesBlur(event: FocusEvent) {
    this.minutesFocused = false;
    this.inputMinutes.nativeElement.value = this.valueMinutes = this.parseValue(
      (event.target as HTMLInputElement).value,
      0,
      0,
      59,
      ''
    );
    this.transmit();
  }

  private transmit() {
    const newValue = this.combineValue(this.valueHours, this.valueMinutes);
    if (this.value !== newValue) {
      this.value = newValue;
      this.transmitValue(this.value, { eventType: [InputEventType.onBlur] });
    }
  }

  private parseValue(
    value: string,
    mod: number,
    minValue: number,
    maxValue: number,
    def: any = ''
  ): string {
    const parsed = parseInt(value, 10);
    if (parsed !== parsed) {
      return def;
    }
    return mod > -1
      ? padWith0(Math.min(Math.max(parsed + mod, minValue), maxValue))
      : padWith0(Math.max(Math.min(parsed - 1, maxValue), minValue));
  }

  private splitValue(value: string, index = 0): any {
    return isString(value) || isNumber(value)
      ? this.parseValue(value.split(':')[index], 0, 0, index === 0 ? 23 : 59, 0)
      : undefined;
  }

  private combineValue(valueHours: string, valueMinutes: string): string {
    return valueHours === '' && valueMinutes === ''
      ? null
      : `${valueHours || '00'}:${valueMinutes || '00'}`;
  }

  private switchInputs() {
    if (this.hoursFocused) {
      this.inputMinutes.nativeElement.focus();
      this.inputMinutes.nativeElement.setSelectionRange(0, 0);
    } else if (this.minutesFocused) {
      this.inputHours.nativeElement.focus();
      this.inputHours.nativeElement.setSelectionRange(2, 2);
    }
  }
}
