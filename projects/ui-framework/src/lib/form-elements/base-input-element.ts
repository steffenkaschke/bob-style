import { EventEmitter, Input, Output, HostBinding } from '@angular/core';
import { InputEvent } from './input/input.interface';
import { BaseFormElement } from './base-form-element';
import {
  InputAutoCompleteOptions,
  InputEventType,
  InputTypes
} from './input/input.enum';

export abstract class BaseInputElement extends BaseFormElement {
  @Input() inputType: InputTypes;
  @Input() enableBrowserAutoComplete: InputAutoCompleteOptions =
    InputAutoCompleteOptions.off;
  @Output() inputEvents: EventEmitter<InputEvent> = new EventEmitter<
    InputEvent
  >();

  @HostBinding('class')
  get classes(): string {
    return (
      (this.disabled ? 'disbled ' : '') +
      (this.required ? 'required ' : '') +
      (this.errorMessage && !this.disabled ? 'error ' : '') +
      (this.warnMessage && !this.errorMessage && !this.disabled ? 'warn' : '')
    );
  }

  protected constructor() {
    super();
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
