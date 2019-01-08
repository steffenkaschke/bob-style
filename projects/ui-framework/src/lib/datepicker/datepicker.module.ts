import {NgModule} from '@angular/core';
import {DatepickerComponent} from './datepicker.component';
import {MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule} from '@angular/material';
import 'hammerjs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {IconsModule} from '../icons';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [DatepickerComponent],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    IconsModule
  ],
  exports: [
    DatepickerComponent,
  ],
  providers: [],
})
export class DatepickerModule {
}
