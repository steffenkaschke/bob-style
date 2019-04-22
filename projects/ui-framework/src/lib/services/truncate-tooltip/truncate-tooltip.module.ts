import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsModule } from '../../services/utils/utils.module';
import { UtilsService } from '../../services/utils/utils.service';
import { TruncateTooltipComponent } from './truncate-tooltip.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TruncateTooltipDirective } from './truncate-tooltip.directive';

@NgModule({
  imports: [CommonModule, UtilsModule, MatTooltipModule],
  declarations: [TruncateTooltipComponent, TruncateTooltipDirective],
  exports: [TruncateTooltipComponent, TruncateTooltipDirective],
  providers: [UtilsService],
  entryComponents: [TruncateTooltipComponent]
})
export class TruncateTooltipModule {}
