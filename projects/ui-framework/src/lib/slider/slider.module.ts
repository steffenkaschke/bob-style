import {NgModule} from '@angular/core';
import {SliderComponent} from './slider.component';
import {MatSliderModule} from '@angular/material';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import 'hammerjs';

@NgModule({
  declarations: [SliderComponent],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    MatSliderModule,
  ],
  exports: [
    SliderComponent,
  ],
  providers: [],
})
export class SliderModule {
}
