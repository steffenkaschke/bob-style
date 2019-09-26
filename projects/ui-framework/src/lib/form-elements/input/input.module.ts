import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input.component';
import { InputMessageModule } from '../input-message/input-message.module';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { FormElementKeyboardCntrlService } from '../services/keyboard-cntrl.service';

@NgModule({
  declarations: [InputComponent],
  imports: [CommonModule, InputMessageModule],
  exports: [InputComponent],
  providers: [
    DOMhelpers,
    EventManagerPlugins[0],
    FormElementKeyboardCntrlService
  ]
})
export class InputModule {}
