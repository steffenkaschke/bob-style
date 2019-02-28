import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RangeDatepickerComponent } from './range-datepicker/range-datepicker.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [RangeDatepickerComponent],
  exports: [RangeDatepickerComponent],
  imports: [
    CommonModule,
    NgbDatepickerModule
  ]
})
export class RangeDatepickerModule { }
