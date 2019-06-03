import { NgModule } from '@angular/core';
import { DatepickerComponent } from './datepicker.component';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { IconsModule } from '../../icons/icons.module';
import { CommonModule } from '@angular/common';
import { InputMessageModule } from '../input-message/input-message.module';

@NgModule({
  declarations: [DatepickerComponent],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    IconsModule,
    InputMessageModule
  ],
  exports: [DatepickerComponent],
  entryComponents: [DatepickerComponent],
  providers: []
})
export class DatepickerModule {}
