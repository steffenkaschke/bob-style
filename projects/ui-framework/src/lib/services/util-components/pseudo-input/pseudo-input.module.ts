import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PseudoInputComponent } from './pseudo-input.component';

@NgModule({
  imports: [CommonModule],
  declarations: [PseudoInputComponent],
  exports: [PseudoInputComponent],
  providers: [],
})
export class PseudoInputModule {}
