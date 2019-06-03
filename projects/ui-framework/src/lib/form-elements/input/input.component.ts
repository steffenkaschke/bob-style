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
import { simpleUID } from '../../services/utils/functional-utils';

export const baseInputTemplate = `
  <label *ngIf="label" class="bfe-label" [attr.for]="id">{{label}}</label>

  <div class="bfe-wrap" [ngClass]="{focused: inputFocused, hasPrefix: hasPrefix, hasSuffix: hasSuffix}">

    <div *ngIf="hasPrefix" class="bfe-prefix" #prefix>
      <ng-content select="[input-prefix]"></ng-content>
    </div>

    <input class="bfe-input"
          [attr.placeholder]="placeholder"
          [attr.id]="id"
          [type]="inputType"
          [attr.value]="value"
          [autocomplete]="enableBrowserAutoComplete"
          [disabled]="disabled"
          [required]="required"
          (focus)="onFocus()"
          (blur)="onBlur()"
          (input)="onChange($event)"
          #bInput
          #moreattributes>

    <div *ngIf="hasSuffix" class="bfe-suffix" #suffix>
      <ng-content select="[input-suffix]"></ng-content>
    </div>

  </div>

  <p b-input-message
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

  public hasPrefix = true;
  public hasSuffix = true;
  public inputFocused = false;
  public id = simpleUID('bfe-');
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

  onChange($event): void {
    this.value = $event.target.value;
    this.emitInputEvent(InputEventType.onChange, this.value);
  }

  onFocus(): void {
    this.inputFocused = true;
    this.emitInputEvent(InputEventType.onFocus, this.value);
  }

  onBlur(): void {
    this.inputFocused = false;
    this.emitInputEvent(InputEventType.onBlur, this.value);
  }
}
