import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from './checkbox.component';
import { InputMessageModule } from '../input-message/input-message.module';

@NgModule({
  declarations: [CheckboxComponent],
  imports: [CommonModule, InputMessageModule],
  exports: [CheckboxComponent]
})
export class CheckboxModule {}
