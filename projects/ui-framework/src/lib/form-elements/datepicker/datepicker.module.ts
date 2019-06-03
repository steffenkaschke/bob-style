import { NgModule } from '@angular/core';
import { DatepickerComponent } from './datepicker.component';
import {
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule
} from '@angular/material';
import { IconsModule } from '../../icons/icons.module';
import { CommonModule } from '@angular/common';
import { InputModule } from '../input/input.module';
import { DatepickerInputComponent } from './datepicker-input.component';
import { FormsModule } from '@angular/forms';
import { InputMessageModule } from '../input-message/input-message.module';

@NgModule({
  declarations: [DatepickerInputComponent, DatepickerComponent],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    IconsModule,
    InputModule,
    FormsModule,
    InputMessageModule
  ],
  exports: [DatepickerComponent],
  entryComponents: [DatepickerComponent],
  providers: []
})
export class DatepickerModule {}
