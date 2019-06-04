import { NgModule } from '@angular/core';
import { ChipComponent } from './chip/chip.component';
import { CommonModule } from '@angular/common';
import { ColorService } from '../../services/color-service/color.service';
import { ChipInputComponent } from './chip-input/chip-input.component';
import { MatAutocompleteModule } from '@angular/material';
import { IconsModule } from '../../icons/icons.module';
import { InputMessageModule } from '../../form-elements/input-message/input-message.module';

@NgModule({
  declarations: [ChipComponent, ChipInputComponent],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    IconsModule,
    InputMessageModule
  ],
  exports: [ChipComponent, ChipInputComponent],
  providers: [ColorService]
})
export class ChipsModule {}
