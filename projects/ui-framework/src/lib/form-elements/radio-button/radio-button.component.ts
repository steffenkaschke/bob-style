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
      (value): string | number => {
        value = this.conformValueToIDtype(value);
        return this.optionsFlat.includes(value) ? value : null;
      }
    ];
    this.wrapEvent = false;
  }

  @Input() value: string | number;
  @Input() options: string[] | RadioConfig[];
  @Input() direction: RadioDirection = RadioDirection.row;

  public dir = RadioDirection;
  public idType: string;
  public includeOptionInEvent = true;
  private optionsFlat: (string | number)[] = [];

  @Output(FormEvents.radioChange) changed: EventEmitter<
    InputEvent
  > = new EventEmitter<InputEvent>();

  private checkIDtype(options = this.options as RadioConfig[]): string {
    for (const opt of options) {
      if (!opt.label) {
        return null;
      }
      if (typeof opt.id !== 'number') {
        return 'string';
      }
    }
    return 'number';
  }

  private conformValueToIDtype(value): number | string {
    return this.idType === 'number' ? parseInt(value, 10) : value;
  }

  private transmit(event: InputEventType): void {
    this.transmitValue(this.value, {
      eventType: [event],
      addToEventObj:
        this.idType && this.includeOptionInEvent
          ? {
              option: (this.options as RadioConfig[]).find(
                o => o.id === this.value
              )
            }
          : {}
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options) {
      this.options = changes.options.currentValue;
      this.idType = this.checkIDtype();
      this.optionsFlat = this.idType
        ? (this.options as RadioConfig[]).map(o => o.id)
        : (this.options as string[]);
    }

    if (changes.value || changes.options) {
      this.writeValue(changes.value ? changes.value.currentValue : this.value);
      this.transmit(InputEventType.onWrite);
    }
  }

  public onRadioChange(event): void {
    this.writeValue(event.target.value);
    this.transmit(InputEventType.onBlur);
  }
}
