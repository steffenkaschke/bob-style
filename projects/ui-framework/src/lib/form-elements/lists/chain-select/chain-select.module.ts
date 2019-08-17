import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChainSelectComponent } from './chain-select.component';
import { IconsModule } from '../../../icons/icons.module';
import {
  ComponentRendererModule
} from '../../../services/component-renderer/component-renderer.module';
import { ButtonsModule } from '../../../buttons/buttons.module';
import { ChainSelectDirective } from './chain-select.directive';

@NgModule({
  imports: [
    CommonModule,
    IconsModule,
    ComponentRendererModule,
    ButtonsModule,
  ],
  declarations: [
    ChainSelectComponent,
    ChainSelectDirective,
  ],
  exports: [
    ChainSelectComponent,
    ChainSelectDirective,
  ],
})
export class ChainSelectModule { }
