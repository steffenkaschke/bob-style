import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutoCompleteComponent } from './auto-complete.component';
import { MatAutocompleteModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { InputModule } from '../input/input.module';
import { AvatarModule } from '../../buttons-indicators/avatar/avatar.module';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    AutoCompleteComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    InputModule,
    AvatarModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
  ],
  exports: [
    AutoCompleteComponent,
  ],
})
export class AutoCompleteModule {
}
