import { NgModule } from '@angular/core';
import { ChipComponent } from './chip/chip.component';
import { CommonModule } from '@angular/common';
import { ColorService } from '../../services/color-service/color.service';
import { ChipInputComponent } from './chip-input/chip-input.component';
import {
  MatFormFieldModule,
  MatChipsModule,
  MatAutocompleteModule
} from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IconsModule } from '../../icons/icons.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [ChipComponent, ChipInputComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    IconsModule
  ],
  exports: [ChipComponent, ChipInputComponent],
  providers: [ColorService]
})
export class ChipsModule {}
