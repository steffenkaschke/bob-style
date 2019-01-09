import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {InputEvent, InputEventType, InputTypes} from './input.enum';

export const baseInputTemplate = require('./input.component.html');

@Component({
  selector: 'b-input',
  template: baseInputTemplate.replace('{{attributes-replace}}', ''),
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {

  @Input() inputType: InputTypes;
  @Input() placeholder: string;
  @Input() value: string;
  @Input() disabled: boolean;
  @Input() required: boolean;
  @Input() errorMessage: string;
  @Output() inputEvents: EventEmitter<InputEvent> = new EventEmitter<InputEvent>();

  constructor() {
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
  }
}
