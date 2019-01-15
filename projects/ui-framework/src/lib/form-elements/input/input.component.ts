import { Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { InputAutoCompleteOptions, InputEventType, InputTypes } from './input.enum';
import { inputAttributesPlaceholder } from '../../consts';
import { MatInput } from '@angular/material';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputEvent } from './input.interface';
import { BaseFormElement } from '../base-form-element';


export const baseInputTemplate = require('./input.component.html');

@Component({
  selector: 'b-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent extends BaseFormElement implements OnInit, ControlValueAccessor {

  constructor() {
    super();
  }

  @Input() inputType: InputTypes;
  @Input() placeholder: string;
  @Input() required: boolean;
  @Input() hideLabelOnFocus = false;
  @Input() hintMessage: string;
  @Input() errorMessage: string;
  @Input() enableBrowserAutoComplete: InputAutoCompleteOptions = InputAutoCompleteOptions.off;
  @Output() inputEvents: EventEmitter<InputEvent> = new EventEmitter<InputEvent>();

  @ViewChild('bInput') bInput: MatInput;
  eventType = InputEventType;

  static addAttributesToBaseInput(attributes: string): string {
    return baseInputTemplate.replace(inputAttributesPlaceholder, attributes);
  }

  ngOnInit() {
  }

  emitInputEvent(
    event: InputEventType,
    value: string | number,
  ): void {
    this.inputEvents.emit({
      event,
      value,
    });
    if (event === InputEventType.onChange) {
      this.propagateChange(value);
    }
  }
}
