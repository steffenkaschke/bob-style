import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelValueComponent } from './label-value.component';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { TruncateTooltipModule } from '../../popups/truncate-tooltip/truncate-tooltip.module';

@NgModule({
  declarations: [LabelValueComponent],
  imports: [CommonModule, TruncateTooltipModule],
  exports: [LabelValueComponent],
  providers: [EventManagerPlugins[0]]
})
export class LabelValueModule {}
