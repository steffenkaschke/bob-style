import { NgModule } from '@angular/core';
import { ChipComponent } from './chip.component';
import { ChipInputComponent } from '../../form-elements/chip-input/chip-input.component';
import { ChipModule } from './chip.module';
import { ChipInputModule } from '../../form-elements/chip-input/chip-input.module';

@NgModule({
  declarations: [],
  imports: [ChipModule, ChipInputModule],
  exports: [ChipComponent, ChipInputComponent],
  providers: []
})
export class ChipsModule {}
