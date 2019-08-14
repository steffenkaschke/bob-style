import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmojiComponent } from './emoji.component';
import { TypographyModule } from '../../typography/typography.module';
import {EventManagerPlugins} from '../../services/utils/eventManager.plugins';

@NgModule({
  imports: [
    CommonModule,
    TypographyModule
  ],
  declarations: [
    EmojiComponent,
  ],
  providers: [
    EventManagerPlugins[0]
  ],
  exports: [
    EmojiComponent
  ]
})
export class EmojiModule { }
