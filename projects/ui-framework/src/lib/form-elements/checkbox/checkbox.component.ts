import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ElementRef,
  ViewChild
} from '@angular/core';
import { BaseFormElement } from '../base-form-element';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputEvent } from '../input/input.interface';
import { InputEventType } from '../input/input.enum';

@Component({
  selector: 'b-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ]
})
export class CheckboxComponent extends BaseFormElement {
  constructor() {
    super();
  }

  @ViewChild('input') private input: ElementRef;
  @Input() value = false;

  @Input('indeterminate')
  set indState(value: boolean) {
    this.input.nativeElement.indeterminate = value;
  }

  @Output() checkboxChange: EventEmitter<InputEvent> = new EventEmitter<
    InputEvent
  >();

  toggleCheckbox(): void {
    this.value = !this.value;

    this.transmitValue(this.value, [InputEventType.onBlur], 'checkboxChange');
  }
}
