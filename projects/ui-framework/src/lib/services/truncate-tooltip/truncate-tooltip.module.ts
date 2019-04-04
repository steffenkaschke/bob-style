import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruncateTooltipDirective } from './truncate-tooltip.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [TruncateTooltipDirective],
  exports: [TruncateTooltipDirective]
})
export class TruncateTooltipModule {}
