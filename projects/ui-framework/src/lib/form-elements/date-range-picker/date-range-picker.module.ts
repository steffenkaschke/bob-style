import { NgModule } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { IconsModule } from '../../icons/icons.module';
import { CommonModule } from '@angular/common';
import { InputMessageModule } from '../input-message/input-message.module';
import { DateRangePickerComponent } from './date-range-picker.component';
import { DateTimeInputService } from '../datepicker/date-time-input.service';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';

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
  providers: [DateTimeInputService, EventManagerPlugins[0]]
})
export class DateRangePickerModule {}
