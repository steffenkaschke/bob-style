import { EventEmitter, Input, Output, NgZone } from '@angular/core';
import { InputEvent } from './input/input.interface';
import { BaseFormElement } from './base-form-element';
import { InputAutoCompleteOptions, InputTypes } from './input/input.enum';
import { FormEvents, InputEventType } from './form-elements.enum';
import { isKey } from '../services/utils/functional-utils';
import { Keys } from '../enums';
import { asNumber, stringyOrFail } from '../services/utils/transformers';

export abstract class BaseInputElement extends BaseFormElement {
  protected constructor(protected zone: NgZone) {
    super();
    this.inputTransformers = [stringyOrFail];
    this.outputTransformers = [value => asNumber(this.inputType, value)];
    this.baseValue = '';
  }

  public eventType = InputEventType;

  @Input() value = '';
  @Input() inputType: InputTypes = InputTypes.text;
  @Input() enableBrowserAutoComplete: InputAutoCompleteOptions =
    InputAutoCompleteOptions.off;
  @Input() maxChars: number;

  @Output(FormEvents.inputEvents) changed: EventEmitter<
    InputEvent
  > = new EventEmitter<InputEvent>();

  onInputChange(event) {
    if (
      event.target.value !== this.value &&
      this.changed.observers.length > 0
    ) {
      this.zone.run(() => {
        this.writeValue(event.target.value);
        this.transmitValue(this.value, {
          eventType: [InputEventType.onChange]
        });
      });
    }
  }

  onInputFocus() {
    this.transmitValue(this.value, { eventType: [InputEventType.onFocus] });
    this.inputFocused = true;
  }

  onInputBlur() {
    this.transmitValue(this.value, { eventType: [InputEventType.onBlur] });
    this.inputFocused = false;
  }

  onInputKey(event: KeyboardEvent) {
    if (
      (isKey(event.key, Keys.enter) || isKey(event.key, Keys.escape)) &&
      this.changed.observers.length > 0
    ) {
      this.zone.run(() => {
        this.transmitValue(this.value, {
          eventType: [InputEventType.onKey],
          doPropagate: false,
          addToEventObj: {
            key: event.key
          }
        });
      });
    }
  }
}
