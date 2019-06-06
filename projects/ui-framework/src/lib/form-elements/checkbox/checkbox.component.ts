import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ElementRef,
  ViewChild
} from '@angular/core';
import { BaseFormElement } from '../base-form-element';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

export enum CheckboxStates {
  checked = 'checked',
  unchecked = 'unchecked',
  indeterminate = 'indeterminate'
}

@Component({
  selector: 'b-checkbox',
  templateUrl: './checkbox.component.html',
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
  @Input() value = false;

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
