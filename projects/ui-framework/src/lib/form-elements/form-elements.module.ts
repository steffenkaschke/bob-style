import { NgModule } from '@angular/core';
import {InputModule} from './input/input.module';
import {DatepickerModule} from './datepicker';
import {DatepickerComponent} from './datepicker/datepicker.component';
import {InputComponent} from './input/input.component';

@NgModule({
  imports: [
    InputModule,
    DatepickerModule,
  ],
  exports: [
    InputComponent,
    DatepickerComponent,
  ],
})
export class FormElementsModule {
}
