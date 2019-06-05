import {
  Input,
  HostBinding,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { ControlValueAccessor, FormControl } from '@angular/forms';
import { simpleUID } from '../services/utils/functional-utils';
import { InputEvent } from './input/input.interface';
import { InputEventType } from './input/input.enum';

export abstract class BaseFormElement
  implements ControlValueAccessor, OnChanges {
  @HostBinding('class')
  get classes(): string {
    return (
      (this.disabled ? 'disabled ' : '') +
      (this.required ? 'required ' : '') +
      (this.errorMessage && !this.disabled ? 'error ' : '') +
      (this.warnMessage && !this.errorMessage && !this.disabled
        ? 'warn '
        : '') +
      (this.label ? 'has-label ' : '') +
      (this.hintMessage ||
      (this.errorMessage && !this.disabled) ||
      (this.warnMessage && !this.disabled)
        ? 'has-message'
        : '')
    );
  }
  @Input() label: string;
  @Input() placeholder: string;
  @Input() value: any;
  @Input() disabled: boolean;
  @Input() required: boolean;
  @Input() hideLabelOnFocus = false;
  @Input() hintMessage: string;
  @Input() errorMessage: string;
  @Input() warnMessage: string;

  @Output() changed: EventEmitter<any> = new EventEmitter<any>();

  protected writingValue = false;
  public inputFocused = false;
  public inputTouched = false;
  public initialized = false;

  public id = simpleUID('bfe-');

  protected onNgChanges(changes: SimpleChanges): void {}
  @Input() validateFn: Function = (_: FormControl) => {};

  onTouched: Function = (_: any) => {};

  propagateChange: Function = (_: any) => {};

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(c: FormControl) {
    return this.validateFn(c);
  }

  writeValue(value: any): void {
    if (value !== undefined) {
      this.writingValue = true;
      this.applyValue(value);
    }
  }

  protected applyValue(value: any): void {
    this.value = value;
    if (!this.writingValue) {
      this.transmitValue(value);
    } else {
      this.writingValue = false;
    }
  }

  protected transmitValue(value: any): void {
    this.changed.emit({
      event: 'BASEFORM' + InputEventType.onChange,
      value
    } as InputEvent);
    this.propagateChange(value);
    this.writingValue = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value) {
      this.applyValue(changes.value.currentValue);
    }
    this.onNgChanges(changes);
  }
}
