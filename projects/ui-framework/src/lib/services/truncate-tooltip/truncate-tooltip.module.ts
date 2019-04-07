import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsModule } from '../../services/utils/utils.module';
import { UtilsService } from '../../services/utils/utils.service';
import { TruncateTooltipComponent } from './truncate-tooltip.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [CommonModule, UtilsModule, MatTooltipModule],
  declarations: [TruncateTooltipComponent],
  exports: [TruncateTooltipComponent],
  providers: [UtilsService]
})
export class TruncateTooltipModule {}
