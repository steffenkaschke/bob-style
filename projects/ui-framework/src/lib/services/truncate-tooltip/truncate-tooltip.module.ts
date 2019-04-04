import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsModule } from '../../services/utils/utils.module';
import { UtilsService } from '../../services/utils/utils.service';
import { TruncateTooltipDirective } from './truncate-tooltip.directive';

@NgModule({
  imports: [CommonModule, UtilsModule],
  declarations: [TruncateTooltipDirective],
  exports: [TruncateTooltipDirective],
  providers: [UtilsService]
})
export class TruncateTooltipModule {}
