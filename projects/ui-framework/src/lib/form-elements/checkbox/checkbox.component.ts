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
      [attr.id]="id"
      [checked]="value"
      (change)="toggleCheckbox()"
      [required]="required"
      [disabled]="disabled"
    />
    <label class="bchk-label" [attr.for]="id">
      {{ label }}
    </label>
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
  @Input() disabled: boolean;
  @Input() required: boolean;

  // indeterminate = false;
  @Input('indeterminate')
  set indState(value: boolean) {
    // this.indeterminate = value;
    this.input.nativeElement.indeterminate = value;
  }

  @Output() checkboxChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  toggleCheckbox(): void {
    // this.indeterminate = false;
    this.value = !this.value;
    this.propagateChange(this.value);
    this.onTouched();
    this.checkboxChange.emit(this.value);
  }
}
