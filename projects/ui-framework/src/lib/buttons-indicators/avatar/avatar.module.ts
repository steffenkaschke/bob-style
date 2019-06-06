import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from './avatar.component';
import { IconsModule } from '../../icons/icons.module';
import { TruncateTooltipModule } from '../../services/truncate-tooltip/truncate-tooltip.module';
import { ChipModule } from '../chip/chip.module';

@NgModule({
  declarations: [AvatarComponent],
  imports: [CommonModule, IconsModule, TruncateTooltipModule, ChipModule],
  exports: [AvatarComponent],
  entryComponents: [AvatarComponent]
})
export class AvatarModule {}
