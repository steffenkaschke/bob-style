import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioButtonComponent } from './radio-button.component';
import { InputMessageModule } from '../input-message/input-message.module';

@NgModule({
  declarations: [RadioButtonComponent],
  imports: [CommonModule, InputMessageModule],
  exports: [RadioButtonComponent]
})
export class RadioButtonModule {}
