import { NgModule } from '@angular/core';
import { TextareaComponent } from './textarea.component';
import {
  MatFormFieldModule,
  MatIconModule,
  MatInputModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputMessageModule } from '../input-message/input-message.module';

@NgModule({
  declarations: [TextareaComponent],
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    CommonModule,
    InputMessageModule
  ],
  exports: [TextareaComponent]
})
export class TextareaModule {}
