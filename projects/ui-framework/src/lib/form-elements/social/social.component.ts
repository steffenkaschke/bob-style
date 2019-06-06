import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  forwardRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { IconColor, IconSize } from '../../icons/icons.enum';
import { InputEvent } from '../input/input.interface';
import { InputTypes } from '../input/input.enum';
import { SocialTypes } from './social.const';
import { Social } from './social.enum';
import { BaseFormElement } from '../base-form-element';

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
  constructor() {
    super();
    this.inputTransformers = [value => value.split('/')[1]];
    this.outputTransformers = [
      value => `${SocialTypes[this.type].prefix}${value}`
    ];
  }

  @Input() type: Social;
  @Output() socialInputChange: EventEmitter<string> = new EventEmitter<
    string
  >();

  public readonly iconSize = IconSize;
  public readonly iconColor = IconColor;
  public readonly inputTypes = InputTypes;
  public readonly socialTypes = SocialTypes;

  public onInputEvents(event: InputEvent): void {
    this.transmitValue(event.value, event.event, 'socialInputChange');
  }
}
