import {NgModule} from '@angular/core';
import {DatepickerComponent} from './datepicker.component';
import {MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule} from '@angular/material';
import 'hammerjs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [DatepickerComponent],
  imports: [
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule
  ],
  exports: [
    DatepickerComponent,
  ],
  providers: [],
})
export class DatepickerModule {
}
