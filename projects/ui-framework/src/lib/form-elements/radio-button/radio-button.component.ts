import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormElement } from '../base-form-element';
import { RadioDirection } from './radio-button.enum';
import { InputEventType } from '../form-elements.enum';
import { RadioConfig } from './radio-button.interface';
import { compareAsStrings } from '../../services/utils/functional-utils';
import { FormEvents } from '../form-elements.enum';
import { InputEvent } from '../input/input.interface';

@Component({
  selector: 'b-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RadioButtonComponent),
      multi: true
    }
  ]
})
export class RadioButtonComponent extends BaseFormElement {
  constructor() {
    super();
    this.inputTransformers = [
      (value): string => {
        return ((this.options as RadioConfig[])[0].label &&
          !Object.values(this.options).includes(value)) ||
          !(this.options as string[]).includes(value)
          ? null
          : (value as string);
      }
    ];
  }

  @Input() value: string;
  @Input() options: string[] | RadioConfig[];
  @Input() direction: RadioDirection = RadioDirection.row;

  public dir = RadioDirection;
  public compare = compareAsStrings;

  @Output(FormEvents.radioChange) changed: EventEmitter<
    InputEvent
  > = new EventEmitter<InputEvent>();

  onRadioChange(event): void {
    this.value = event.target.value;

    this.transmitValue(this.value, { eventType: [InputEventType.onBlur] });
  }

  // add - sense ID format (string/number) - onNgChanges optiopns
  // ass - pass any props in RadioConfig with value output
}
