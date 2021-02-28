import { NgModule } from '@angular/core';

import { ColorPickerInputComponent } from './color-picker-input.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { CommonModule } from '@angular/common';
import { FormElementLabelModule, InputMessageModule } from 'bob-style';


@NgModule({
  imports: [CommonModule, ColorPickerModule, FormElementLabelModule, InputMessageModule],
  exports: [ColorPickerInputComponent],
  declarations: [ColorPickerInputComponent],
  providers: [],
})
export class ColorPickerInputModule {
}
