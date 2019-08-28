import { NgModule } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { IconsModule } from '../../icons/icons.module';
import { CommonModule } from '@angular/common';
import { InputMessageModule } from '../input-message/input-message.module';
import { DateRangePickerComponent } from './date-range-picker.component';

@NgModule({
  declarations: [DateRangePickerComponent],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    IconsModule,
    InputMessageModule
  ],
  exports: [DateRangePickerComponent],
  entryComponents: [],
  providers: []
})
export class DateRangePickerModule {}
