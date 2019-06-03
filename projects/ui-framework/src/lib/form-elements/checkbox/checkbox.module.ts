import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from './checkbox.component';
import { MatPseudoCheckboxModule } from '@angular/material/';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { InputMessageModule } from '../input-message/input-message.module';

@NgModule({
  declarations: [CheckboxComponent],
  imports: [
    CommonModule,
    MatPseudoCheckboxModule,
    MatCheckboxModule,
    InputMessageModule
  ],
  exports: [CheckboxComponent]
})
export class CheckboxModule {}
