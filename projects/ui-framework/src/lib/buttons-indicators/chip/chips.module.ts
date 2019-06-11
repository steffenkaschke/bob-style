import { NgModule } from '@angular/core';
import { ChipComponent } from './chip.component';
import { ColorService } from '../../services/color-service/color.service';
import { ChipInputComponent } from '../../form-elements/chip-input/chip-input.component';
import { ChipInputModule } from '../../form-elements/chip-input/chip-input.module';
import { ChipModule } from './chip.module';

@NgModule({
  declarations: [ChipComponent, ChipInputComponent],
  imports: [ChipModule, ChipInputModule],
  exports: [ChipComponent, ChipInputComponent],
  providers: [ColorService]
})
export class ChipsModule {}
