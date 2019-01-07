import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InputEvent, InputEventType, InputTypes } from './input.enum';

@Component({
  selector: 'b-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  @Input() inputType: InputTypes;
  @Input() placeholder: string;
  @Input() value: string;
  @Input() disabled: boolean;
  @Input() required: boolean;
  @Input() errorMessage: string;
  @Output() inputEvents: EventEmitter<InputEvent> = new EventEmitter<InputEvent>();

  inputEventType = InputEventType;

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
