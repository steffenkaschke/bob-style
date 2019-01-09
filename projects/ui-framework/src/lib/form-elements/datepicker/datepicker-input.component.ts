import {Component, Input, OnInit} from '@angular/core';
import {baseInputTemplate, InputComponent} from '../input/input.component';

@Component({
  selector: 'b-datepicker-input',
  template: baseInputTemplate
    .replace('<input matInput', '<input matInput [matDatepicker]="datePickerId"'),
  styleUrls: ['../input/input.component.scss']
})
export class DatepickerInputComponent extends InputComponent implements OnInit {

  @Input() datePickerId: string;

  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
