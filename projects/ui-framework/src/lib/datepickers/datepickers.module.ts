import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RangeDatepickerComponent } from './range-datepicker/range-datepicker.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [RangeDatepickerComponent, DatePickerComponent],
  exports: [RangeDatepickerComponent, DatePickerComponent],
  imports: [
    CommonModule,
    NgbDatepickerModule,
    FormsModule
  ]
})
export class DatepickersModule { }
