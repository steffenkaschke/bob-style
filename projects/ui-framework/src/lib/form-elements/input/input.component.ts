import { Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { InputAutoCompleteOptions, InputEventType, InputTypes } from './input.enum';
import { inputAttributesPlaceholder } from '../../consts';
import { MatInput } from '@angular/material';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputEvent } from './input.interface';


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
    }
  ]
})
export class InputComponent implements OnInit, ControlValueAccessor {

  @Input() inputType: InputTypes;
  @Input() placeholder: string;
  @Input() value: string;
  @Input() disabled: boolean;
  @Input() required: boolean;
  @Input() hideLabelOnFocus = false;
  @Input() hintMessage: string;
  @Input() errorMessage: string;
  @Input() enableBrowserAutoComplete: InputAutoCompleteOptions = InputAutoCompleteOptions.off;
  @Output() inputEvents: EventEmitter<InputEvent> = new EventEmitter<InputEvent>();

  @ViewChild('bInput') bInput: MatInput;
  eventType = InputEventType;

  constructor() {
  }

  static addAttributesToBaseInput(attributes: string): string {
    return baseInputTemplate.replace(inputAttributesPlaceholder, attributes);
  }

  propagateChange: Function = (_: InputEvent) => {
  };

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
}
