import {
  Component,
  forwardRef,
  ViewChild,
  AfterViewInit,
  ElementRef
} from '@angular/core';
import { inputAttributesPlaceholder } from '../../consts';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInputElement } from '../base-input-element';
import { MatInput } from '@angular/material';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';

export const baseInputTemplate = `
  <label *ngIf="label" class="bfe-label" [attr.for]="id">{{label}}</label>

  <div class="bfe-wrap" [ngClass]="{focused: inputFocused, hasPrefix: hasPrefix, hasSuffix: hasSuffix}">

    <div *ngIf="hasPrefix" class="bfe-prefix" #prefix>
      <ng-content select="[input-prefix]"></ng-content>
    </div>

    <input #bInput
          class="bfe-input"
          [attr.id]="id"
          [attr.name]="id"
          [type]="inputType"
          [attr.placeholder]="placeholder"
          [attr.value]="value"
          [autocomplete]="enableBrowserAutoComplete"
          [disabled]="disabled"
          [required]="required"
          (focus)="onFocus()"
          (blur)="onBlur()"
          (input)="onChange($event)"
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
