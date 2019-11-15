import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
  ViewChild,
  OnInit,
  NgZone,
  SimpleChanges,
  OnChanges,
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
import { URLutils } from '../../services/url/url-utils.service';

@Component({
  selector: 'b-social',
  templateUrl: 'social.component.html',
  styleUrls: ['social.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SocialComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SocialComponent),
      multi: true,
    },
  ],
})
export class SocialComponent extends BaseFormElement
  implements OnChanges, OnInit {
  constructor(private URL: URLutils, private zone: NgZone) {
    super();
    this.inputTransformers = [
      stringyOrFail,
      (value: string): string => {
        if (!value) {
          return '';
        }
        if (SocialTypes[this.type].parseReplace) {
          SocialTypes[this.type].parseReplace.forEach(rplc => {
            value = value.replace(rplc.a, rplc.b);
          });
        }
        return this.URL.path(value);
      },
    ];
    this.outputTransformers = [
      (value: string): string =>
        value ? `http://${SocialTypes[this.type].prefix}${value}` : '',
    ];
    this.baseValue = '';
    this.wrapEvent = false;
  }

  @ViewChild('bInput', { static: true }) bInput: InputComponent;

  @Input() type: Social;
  @Output(FormEvents.socialInputChange) changed: EventEmitter<
    InputEvent
  > = new EventEmitter<InputEvent>();

  public inputId: string;

  readonly iconSize = IconSize;
  readonly iconColor = IconColor;
  readonly inputTypes = InputTypes;
  readonly socialTypes = SocialTypes;
  readonly socialLabelMap = {
    [Social.facebook]: 'Facebook',
    [Social.twitter]: 'Twitter',
    [Social.linkedin]: 'Linkedin',
  };

  ngOnInit(): void {
    this.inputId = this.bInput.id;
  }

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);

    if (changes.type && !changes.type.firstChange && this.value) {
      this.type = changes.type.currentValue;
      this.writeValue(this.value);
      this.transmitValue(this.value, {
        eventType: [InputEventType.onBlur],
      });
    }
  }

  focusInput(): void {
    this.bInput.input.nativeElement.focus();
  }

  onInputEvents(event: InputEvent): void {
    if (event.event === InputEventType.onChange) {
      this.writeValue(event.value);
      this.transmitValue(this.value, {
        eventType: [InputEventType.onChange],
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
