import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ElementRef,
  ViewChild
} from '@angular/core';
import { set } from 'lodash';
import { BaseFormElement } from '../base-form-element';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { simpleUID } from '../../services/utils/functional-utils';

export enum CheckboxStates {
  checked = 'checked',
  unchecked = 'unchecked',
  indeterminate = 'indeterminate'
}

@Component({
  selector: 'b-checkbox',
  template: `
    <input
      #input
      type="checkbox"
      class="bchk-input"
      [ngClass]="{
        error: errorMessage && !disabled
      }"
      [attr.id]="id"
      [checked]="value"
      [required]="required"
      [disabled]="disabled"
      (change)="toggleCheckbox()"
    />
    <label class="bchk-label" [attr.for]="id">
      {{ label }}
    </label>
    <p
      class="message"
      *ngIf="errorMessage || hintMessage"
      [ngClass]="{
        'error-message': errorMessage && !disabled,
        'hint-message': !errorMessage && hintMessage
      }"
    >
      {{ errorMessage && !disabled ? errorMessage : hintMessage }}
    </p>
  `,
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ]
})
export class CheckboxComponent extends BaseFormElement {
  constructor() {
    super();
  }

  @ViewChild('input') private input: ElementRef;
  @Input() id = simpleUID('bchk-input-');
  @Input() value = false;
  @Input() label: string;
  @Input() disabled = false;
  @Input() required = false;

  @Input('indeterminate')
  set indState(value: boolean) {
    this.input.nativeElement.indeterminate = value;
  }

  @Output() checkboxChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  toggleCheckbox(): void {
    this.value = !this.value;
    this.propagateChange(this.value);
    this.onTouched();
    this.checkboxChange.emit(this.value);
  }
}
