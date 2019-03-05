import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RangeDatepickerComponent } from './range-datepicker/range-datepicker.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from './date-picker/date-picker.component';

@NgModule({
  declarations: [RangeDatepickerComponent, DatePickerComponent],
  exports: [RangeDatepickerComponent, DatePickerComponent],
  imports: [
    CommonModule,
    NgbDatepickerModule
  ]
})
export class DatepickersModule { }
