import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimePickerComponent } from './timepicker.component';
import { InputMessageModule } from '../input-message/input-message.module';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { IconsModule } from '../../icons/icons.module';
import { DateTimeInputService } from '../datepicker/date-time-input.service';
import { FormElementKeyboardCntrlService } from '../services/keyboard-cntrl.service';

@NgModule({
  declarations: [TimePickerComponent],
  imports: [CommonModule, InputMessageModule, IconsModule],
  exports: [TimePickerComponent],
  providers: [
    DateTimeInputService,
    FormElementKeyboardCntrlService,
    EventManagerPlugins[0]
  ]
})
export class TimePickerModule {}
