import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input.component';
import { InputMessageModule } from '../input-message/input-message.module';

@NgModule({
  declarations: [InputComponent],
  imports: [CommonModule, InputMessageModule],
  exports: [InputComponent]
})
export class InputModule {}
