import {
  Input,
  HostBinding,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { ControlValueAccessor, FormControl } from '@angular/forms';
import { simpleUID, asArray } from '../services/utils/functional-utils';
import { InputEvent } from './input/input.interface';
import { InputEventType } from './form-elements.enum';
import { FormEvents } from './form-elements.enum';

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
  @Input() hintMessage: string;
  @Input() errorMessage: string;
  @Input() warnMessage: string;
  @Input() doPropagate = true;

  @Output() changed: EventEmitter<any> = new EventEmitter<any>();

  public inputFocused = false;
  public id = simpleUID('bfe-');
  public inputTransformers: Function[] = [];
  public outputTransformers: Function[] = [];

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
      this.value = this.inputTransformers.reduce(
        (previousResult, fn) => fn(previousResult),
        value
      );
    }
  }

  protected transmitValue(
    value: any = this.value,
    eventType: InputEventType | InputEventType[] = [InputEventType.onChange],
    eventName = FormEvents.changed,
    doPropagate = this.doPropagate,
    addToEventObj = {}
  ): void {
    if (value !== undefined) {
      eventType = asArray(eventType);

      value = this.outputTransformers.reduce(
        (previousResult, fn) => fn(previousResult),
        value
      );

      if (eventName) {
        eventType.forEach(event => {
          this[eventName].emit({
            event,
            value,
            ...addToEventObj
          } as InputEvent);
        });
      }

      if (doPropagate) {
        if (!eventType.includes(InputEventType.onFocus)) {
          this.propagateChange(value);
        }

        if (eventType.includes(InputEventType.onBlur)) {
          this.onTouched();
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value) {
      this.writeValue(changes.value.currentValue);
      this.transmitValue(this.value, [InputEventType.onWrite]);
    }
    this.onNgChanges(changes);
  }
}
