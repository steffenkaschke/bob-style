import { NgModule } from '@angular/core';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input.component';
import { InputMessageModule } from '../input-message/input-message.module';

@NgModule({
  declarations: [InputComponent],
  imports: [
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    InputMessageModule
  ],
  exports: [InputComponent]
})
export class InputModule {}
