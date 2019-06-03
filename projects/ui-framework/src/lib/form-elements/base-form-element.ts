import { Input } from '@angular/core';
import { ControlValueAccessor, FormControl } from '@angular/forms';
import { simpleUID } from '../services/utils/functional-utils';

export abstract class BaseFormElement implements ControlValueAccessor {
  @Input() label: string;
  @Input() placeholder: string;
  @Input() value: any;
  @Input() disabled: boolean;
  @Input() required: boolean;
  @Input() hideLabelOnFocus = false;
  @Input() hintMessage: string;
  @Input() errorMessage: string;
  @Input() warnMessage: string;
  public inputFocused = false;
  public inputTouched = false;
  public id = simpleUID('bfe-');
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

  writeValue(val: any): void {
    this.value = val;
  }

  validate(c: FormControl) {
    return this.validateFn(c);
  }
}
