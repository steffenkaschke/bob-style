import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
  ViewChild,
  OnInit,
  NgZone
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { IconColor, IconSize } from '../../icons/icons.enum';
import { InputEvent } from '../input/input.interface';
import { InputTypes } from '../input/input.enum';
import { SocialTypes } from './social.const';
import { Social } from './social.enum';
import { BaseFormElement } from '../base-form-element';
import { FormEvents, InputEventType } from '../form-elements.enum';
import { InputComponent } from '../input/input.component';
import { stringyOrFail } from '../../services/utils/transformers';
import { URLutils } from '../../services/url/url-utils';

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
export class SocialComponent extends BaseFormElement implements OnInit {
  constructor(private URL: URLutils, private zone: NgZone) {
    super();
    this.inputTransformers = [
      stringyOrFail,
      value => (value ? this.URL.path(value) : '')
    ];
    this.outputTransformers = [
      value => (value ? `http://${SocialTypes[this.type].prefix}${value}` : '')
    ];
    this.baseValue = '';
    this.wrapEvent = false;
  }

  @ViewChild('bInput', { static: true }) bInput: InputComponent;

  @Input() type: Social;
  @Output(FormEvents.socialInputChange) changed: EventEmitter<
    InputEvent
  > = new EventEmitter<InputEvent>();

  inputId: string;

  readonly iconSize = IconSize;
  readonly iconColor = IconColor;
  readonly inputTypes = InputTypes;
  readonly socialTypes = SocialTypes;
  readonly socialLabelMap = {
    [Social.facebook]: 'Facebook',
    [Social.twitter]: 'Twitter',
    [Social.linkedin]: 'Linkedin'
  };

  ngOnInit(): void {
    this.inputId = this.bInput.id;
  }

  onInputEvents(event: InputEvent): void {
    if (event.event === InputEventType.onChange) {
      this.writeValue(event.value);
      this.transmitValue(this.value, {
        eventType: [InputEventType.onChange]
      });
    }
    if (
      event.event === InputEventType.onFocus ||
      event.event === InputEventType.onBlur
    ) {
      this.transmitValue(this.value, { eventType: [event.event] });
    }
    if (event.event === InputEventType.onBlur) {
      this.zone.runOutsideAngular(() => {
        setTimeout(() => {
          this.bInput.input.nativeElement.value = this.value;
        }, 0);
      });
    }
  }
}
