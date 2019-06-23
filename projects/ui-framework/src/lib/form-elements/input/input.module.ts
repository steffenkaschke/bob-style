import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input.component';
import { InputMessageModule } from '../input-message/input-message.module';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';

@NgModule({
  declarations: [InputComponent],
  imports: [CommonModule, InputMessageModule],
  exports: [InputComponent],
  providers: [DOMhelpers]
})
export class InputModule {}
