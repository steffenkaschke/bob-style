import {NgModule} from '@angular/core';
import {SliderComponent} from './slider.component';
import {MatInputModule, MatSliderModule} from '@angular/material';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [SliderComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatInputModule,
    FormsModule,
    MatSliderModule,
  ],
  exports: [
    SliderComponent,
  ],
  providers: [],
})
export class SliderModule {
}
