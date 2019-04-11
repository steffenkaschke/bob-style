import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { ChipComponent } from './chip/chip.component';
import { CommonModule } from '@angular/common';

@NgModule({
  entryComponents: [ChipComponent],
  declarations: [ChipComponent],
  imports: [CommonModule, MatChipsModule],
  exports: [ChipComponent]
})
export class ChipsModule {}
