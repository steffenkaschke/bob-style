import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipListComponent } from './chip-list.component';
import { ChipModule } from '../chip/chip.module';

@NgModule({
  declarations: [ChipListComponent],
  imports: [CommonModule, ChipModule],
  exports: [ChipListComponent],
  providers: []
})
export class ChipListModule {}
