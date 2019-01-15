import { Input } from '@angular/core';
import { ControlValueAccessor, FormControl } from '@angular/forms';
import { InputEvent } from './input/input.interface';

export abstract class BaseFormElement implements ControlValueAccessor {

  @Input() value: string;
  @Input() disabled: boolean;
  @Input() validateFn: Function = (_: FormControl) => {
  };

  propagateChange: Function = (_: InputEvent) => {
  };

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(val: string): void {
    this.value = val;
  }

  validate(c: FormControl) {
    return this.validateFn(c);
  }
}
