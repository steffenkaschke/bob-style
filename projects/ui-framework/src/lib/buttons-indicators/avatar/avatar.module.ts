import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from './avatar.component';
import { IconsModule } from '../../icons/icons.module';
import { TruncateTooltipModule } from '../../services/truncate-tooltip/truncate-tooltip.module';
import { ChipModule } from '../chip/chip.module';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';

@NgModule({
  declarations: [AvatarComponent],
  imports: [CommonModule, IconsModule, TruncateTooltipModule, ChipModule],
  exports: [AvatarComponent],
  entryComponents: [AvatarComponent],
  providers: [DOMhelpers]
})
export class AvatarModule {}
