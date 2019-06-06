import { EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { InputEvent } from './input/input.interface';
import { BaseFormElement } from './base-form-element';
import {
  InputAutoCompleteOptions,
  InputEventType,
  InputTypes
} from './input/input.enum';
import { pass } from '../services/utils/functional-utils';

export abstract class BaseInputElement extends BaseFormElement {
  protected constructor() {
    super();
  }

  public eventType = InputEventType;
  @Input() value: any = '';
  @Input() inputType: InputTypes = InputTypes.text;
  @Input() enableBrowserAutoComplete: InputAutoCompleteOptions =
    InputAutoCompleteOptions.off;
  @Output() inputEvents: EventEmitter<InputEvent> = new EventEmitter<
    InputEvent
  >();

  // this extends BaseFormElement's ngOnChanges
  onNgChanges(changes: SimpleChanges) {
    if (changes.value && !changes.value.currentValue) {
      this.value = '';
    }
  }

  emitInputEvent(event: InputEventType, value: any): void {
    if (value && event === InputEventType.onChange) {
      if (value !== this.value) {
        this.value = value;
        this.transmitValue(value, [event], 'inputEvents');
      }
    }
    if (event === InputEventType.onFocus || event === InputEventType.onBlur) {
      this.transmitValue(this.value, [event], 'inputEvents');
    }
  }
}
