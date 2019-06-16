import { NgModule } from '@angular/core';
import { TextareaComponent } from './textarea.component';
import { CommonModule } from '@angular/common';
import { InputMessageModule } from '../input-message/input-message.module';

@NgModule({
  declarations: [TextareaComponent],
  imports: [CommonModule, InputMessageModule],
  exports: [TextareaComponent]
})
export class TextareaModule {}
