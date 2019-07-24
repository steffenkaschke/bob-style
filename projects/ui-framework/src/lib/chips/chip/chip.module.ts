import { NgModule } from '@angular/core';
import { ChipComponent } from './chip.component';
import { CommonModule } from '@angular/common';
import { ColorService } from '../../services/color-service/color.service';
import { IconsModule } from '../../icons/icons.module';

@NgModule({
  declarations: [ChipComponent],
  imports: [CommonModule, IconsModule],
  exports: [ChipComponent],
  providers: []
})
export class ChipModule {}
