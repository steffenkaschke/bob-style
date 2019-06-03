import {
  Component,
  forwardRef,
  ViewChild,
  AfterViewInit,
  ElementRef
} from '@angular/core';
import { InputEventType } from './input.enum';
import { inputAttributesPlaceholder } from '../../consts';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInputElement } from '../base-input-element';
import { MatInput } from '@angular/material';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';

export const baseInputTemplate = `
  <label class="bff-label" *ngIf="label" [attr.for]="id">
    {{label}}
  </label>

  <div class="bff-wrap" [ngClass]="{focused: inputFouced, hasPrefix: hasPrefix, hasSuffix: hasSuffix}">
    <div class="bff-prefix" #prefix>
      <ng-content select="[input-prefix]"></ng-content>
    </div>

    <input class="bff-input" [attr.id]="id"
          [type]="inputType"
          [value]="value"
          [autocomplete]="enableBrowserAutoComplete"
          [disabled]="disabled"
          [required]="required"
          (blur)="emitInputEvent(eventType.onBlur, value);inputFouced=false;"
          (focus)="emitInputEvent(eventType.onFocus, value); inputFouced=true;"
          (change)="emitInputEvent(eventType.onChange, value)"
          #bInput
          #moreattributes>

    <div class="bff-suffix" #suffix>
      <ng-content select="[input-suffix]"></ng-content>
    </div>

  </div>

  <p class="bff-message"
    b-input-message
    *ngIf="hintMessage || warnMessage || errorMessage"
    [hintMessage]="hintMessage"
    [warnMessage]="warnMessage"
    [errorMessage]="errorMessage"
    [disabled]="disabled"
  ></p>
`;

@Component({
  selector: 'b-input',
  template: baseInputTemplate,
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent extends BaseInputElement implements AfterViewInit {
  constructor() {
    super();
  }
  @ViewChild('bInput') bInput: MatInput;
  @ViewChild('prefix') prefix: ElementRef;
  @ViewChild('suffix') suffix: ElementRef;

  public eventType = InputEventType;
  public hasPrefix = true;
  public hasSuffix = true;

  private DOM = new DOMhelpers();

  static addAttributesToBaseInput(attributes: string): string {
    return baseInputTemplate.replace(inputAttributesPlaceholder, attributes);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.hasPrefix = !this.DOM.isEmpty(this.prefix.nativeElement);
      this.hasSuffix = !this.DOM.isEmpty(this.suffix.nativeElement);
    }, 0);
  }
}
