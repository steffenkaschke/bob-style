import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipModule } from '../chip/chip.module';
import { MultiListAndChipsComponent } from './multi-list-and-chips.component';

@NgModule({
  declarations: [MultiListAndChipsComponent],
  imports: [CommonModule, ChipModule],
  exports: [MultiListAndChipsComponent],
  providers: []
})
export class MultiListAndChipsModule {}
