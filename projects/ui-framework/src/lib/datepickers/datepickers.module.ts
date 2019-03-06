import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RangeDatepickerComponent } from './range-datepicker/range-datepicker.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { RangePicker2Component } from './range-picker2/range-picker2.component';

@NgModule({
  declarations: [RangeDatepickerComponent, DatePickerComponent, RangePicker2Component],
  exports: [RangeDatepickerComponent, DatePickerComponent, RangePicker2Component],
  imports: [
    CommonModule,
    NgbDatepickerModule
  ]
})
export class DatepickersModule { }
