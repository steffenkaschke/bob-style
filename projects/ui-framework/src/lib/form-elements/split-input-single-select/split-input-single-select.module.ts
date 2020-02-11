import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SplitInputSingleSelectComponent } from './split-input-single-select.component';
import { SingleSelectModule } from '../../lists/single-select/single-select.module';
import { InputModule } from '../input/input.module';
import { FormElementLabelModule } from '../form-element-label/form-element-label.module';
import { InputMessageModule } from '../input-message/input-message.module';

@NgModule({
  declarations: [SplitInputSingleSelectComponent],
  imports: [
    FormsModule,
    CommonModule,
    InputModule,
    SingleSelectModule,
    FormElementLabelModule,
    InputMessageModule,
  ],
  exports: [SplitInputSingleSelectComponent],
})
export class SplitInputSingleSelectModule {}
