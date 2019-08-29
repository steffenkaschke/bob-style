import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EmojiComponent} from './emoji.component';
import {TypographyModule} from '../../typography/typography.module';
import {EventManagerPlugins} from '../../services/utils/eventManager.plugins';
import {TruncateTooltipModule} from '../truncate-tooltip/truncate-tooltip.module';
import {PanelModule} from '../panel/panel.module';
import {OverlayModule} from '@angular/cdk/overlay';

@NgModule({
  imports: [
    CommonModule,
    TypographyModule,
    TruncateTooltipModule,
    PanelModule,
    OverlayModule
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
