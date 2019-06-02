import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from './checkbox.component';
import { MatPseudoCheckboxModule } from '@angular/material/';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [CheckboxComponent],
  imports: [CommonModule, MatPseudoCheckboxModule, MatCheckboxModule],
  exports: [CheckboxComponent]
})
export class CheckboxModule {}
