import { NgModule } from '@angular/core';
import { ChipComponent } from './chip/chip.component';
import { CommonModule } from '@angular/common';
import { ColorService } from '../../services/color-service/color.service';

@NgModule({
  declarations: [ChipComponent],
  imports: [CommonModule],
  exports: [ChipComponent],
  providers: [ColorService]
})
export class ChipsModule {}
