import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  forwardRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { BaseInputElement } from '../base-input-element';
import { InputEvent } from '../input/input.interface';
import { InputTypes } from '../input/input.enum';
import { SocialService } from './social.service';
import { SocialTypes } from './social.const';
import { Social } from './social.interface';

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
export class SocialComponent extends BaseInputElement implements OnInit {
  @Input() type: Social;
  @Input() placeholder: string;
  @Output() socialInputChange: EventEmitter<string> = new EventEmitter<
    string
  >();

  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;

  public inputTypes = InputTypes;
  public socialTypes = SocialTypes;

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.value) {
      this.value = SocialService.inputToSocialFormat(this.value);
    }
  }

  public onInputEvents(event: InputEvent): void {
    this.value = event.value as string;
    const socialOutput = SocialService.inputTransformOut(
      this.socialTypes[this.type].prefix,
      this.value
    );
    this.socialInputChange.emit(socialOutput);
  }
}
