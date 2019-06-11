import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
  ElementRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { IconColor, IconSize } from '../../icons/icons.enum';
import { InputEvent } from '../input/input.interface';
import { InputTypes } from '../input/input.enum';
import { SocialTypes } from './social.const';
import { Social } from './social.enum';
import { BaseFormElement } from '../base-form-element';
import { FormEvents, InputEventType } from '../form-elements.enum';

@Component({
  selector: 'b-social',
  templateUrl: 'social.component.html',
  styleUrls: ['social.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SocialComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SocialComponent),
      multi: true
    }
  ]
})
export class SocialComponent extends BaseFormElement {
  constructor(public host: ElementRef) {
    super(host);
    this.inputTransformers = [
      value =>
        value ? (value.split('/')[1] ? value.split('/')[1] : value) : ''
    ];
    this.outputTransformers = [
      value => (value ? `http://${SocialTypes[this.type].prefix}${value}` : '')
    ];
    this.wrapEvent = false;
  }

  @Input() type: Social;
  public readonly iconSize = IconSize;
  public readonly iconColor = IconColor;
  public readonly inputTypes = InputTypes;
  public readonly socialTypes = SocialTypes;

  @Output(FormEvents.socialInputChange) changed: EventEmitter<
    InputEvent
  > = new EventEmitter<InputEvent>();

  public onInputEvents(event: InputEvent): void {
    if (event.event === InputEventType.onChange) {
      this.writeValue(event.value);
      this.transmitValue(this.value, { eventType: [event.event] });
    }
  }
}
