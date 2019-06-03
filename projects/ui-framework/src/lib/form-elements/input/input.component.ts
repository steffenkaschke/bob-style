import {
  Component,
  forwardRef,
  ViewChild,
  AfterViewInit,
  ElementRef
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInputElement } from '../base-input-element';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';

@Component({
  selector: 'b-input',
  templateUrl: './input.component.html',
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
  @ViewChild('bInput') bInput: ElementRef;
  @ViewChild('prefix') prefix: ElementRef;
  @ViewChild('suffix') suffix: ElementRef;

  public hasPrefix = true;
  public hasSuffix = true;
  private DOM = new DOMhelpers();

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.hasPrefix = !this.DOM.isEmpty(this.prefix.nativeElement);
      this.hasSuffix = !this.DOM.isEmpty(this.suffix.nativeElement);
    }, 0);
  }
}
