import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { ChipComponent } from './chip/chip.component';
import { CommonModule } from '@angular/common';
import { ColorService } from '../../services/color-service/color.service';

@NgModule({
  declarations: [ChipComponent],
  imports: [CommonModule, MatChipsModule],
  exports: [ChipComponent],
  providers: [ColorService]
})
export class ChipsModule {}
