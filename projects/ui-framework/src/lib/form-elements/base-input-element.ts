import { EventEmitter, Input, Output, HostBinding } from '@angular/core';
import { InputEvent } from './input/input.interface';
import { BaseFormElement } from './base-form-element';
import {
  InputAutoCompleteOptions,
  InputEventType,
  InputTypes
} from './input/input.enum';
import { simpleUID } from '../services/utils/functional-utils';

export abstract class BaseInputElement extends BaseFormElement {
  public inputFocused = false;
  public id = simpleUID('bfe-');
  @Input() placeholder: string;
  @Input() inputType: InputTypes = InputTypes.text;
  @Input() enableBrowserAutoComplete: InputAutoCompleteOptions =
    InputAutoCompleteOptions.off;
  @Output() inputEvents: EventEmitter<InputEvent> = new EventEmitter<
    InputEvent
  >();

  @HostBinding('class')
  get classes(): string {
    return (
      (this.disabled ? 'disabled ' : '') +
      (this.required ? 'required ' : '') +
      (this.errorMessage && !this.disabled ? 'error ' : '') +
      (this.warnMessage && !this.errorMessage && !this.disabled ? 'warn' : '')
    );
  }

  protected constructor() {
    super();
  }

  onChange($event: any): void {
    this.value = $event.target.value;
    this.emitInputEvent(InputEventType.onChange, this.value);
  }

  onFocus(): void {
    this.inputFocused = true;
    this.emitInputEvent(InputEventType.onFocus, this.value);
  }

  onBlur(): void {
    this.inputFocused = false;
    this.emitInputEvent(InputEventType.onBlur, this.value);
  }

  emitInputEvent(event: InputEventType, value: string | number): void {
    this.inputEvents.emit({
      event,
      value
    });
    if (event === InputEventType.onChange) {
      this.propagateChange(value);
    }
    if (event === InputEventType.onBlur) {
      this.propagateChange(value);
      this.onTouched();
    }
  }
}
