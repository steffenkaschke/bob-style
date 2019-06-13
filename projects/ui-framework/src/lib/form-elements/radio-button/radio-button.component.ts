import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormElement } from '../base-form-element';
import { RadioDirection } from './radio-button.enum';
import { InputEventType } from '../form-elements.enum';
import { RadioConfig } from './radio-button.interface';
import { FormEvents } from '../form-elements.enum';
import { InputEvent } from '../input/input.interface';
import {
  valueInArrayOrFail,
  objectHasKeyOrFail
} from '../../services/utils/transformers';

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
export class RadioButtonComponent extends BaseFormElement implements OnChanges {
  constructor() {
    super();
    this.inputTransformers = [
      objectHasKeyOrFail(this.key),
      value => valueInArrayOrFail(value, this.options, this.key)
    ];
    this.wrapEvent = false;
  }

  @Input() value: RadioConfig;
  @Input() options: RadioConfig[];
  @Input() direction: RadioDirection = RadioDirection.row;

  public dir = RadioDirection;
  public key = 'id';
  public returnId = true;

  @Output(FormEvents.radioChange) changed: EventEmitter<
    InputEvent
  > = new EventEmitter<InputEvent>();

  private transmit(event: InputEventType): void {
    this.transmitValue(this.returnId ? this.value[this.key] : this.value, {
      eventType: [event]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options) {
      this.options = changes.options.currentValue;
    }

    if (changes.value || changes.options) {
      const val = changes.value ? changes.value.currentValue : this.value;
      if (val) {
        this.writeValue(val);
        this.transmit(InputEventType.onWrite);
      }
    }
  }

  public onRadioChange(key): void {
    this.writeValue(this.options.find(o => o[this.key] === key));
    this.transmit(InputEventType.onBlur);
  }
}
