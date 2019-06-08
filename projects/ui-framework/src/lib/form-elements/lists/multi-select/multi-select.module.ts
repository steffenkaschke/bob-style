import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectComponent } from './multi-select.component';
import { PanelModule } from '../../../popups/panel/panel.module';
import { ButtonsModule } from '../../../buttons-indicators/buttons/buttons.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { MultiListModule } from '../multi-list/multi-list.module';
import { ListChangeService } from '../list-change/list-change.service';
import { ListModelService } from '../list-service/list-model.service';
import { TruncateTooltipModule } from '../../../services/truncate-tooltip/truncate-tooltip.module';
import { InputMessageModule } from '../../input-message/input-message.module';

@NgModule({
  declarations: [MultiSelectComponent],
  imports: [
    CommonModule,
    PanelModule,
    ButtonsModule,
    OverlayModule,
    MultiListModule,
    TruncateTooltipModule,
    InputMessageModule
  ],
  exports: [MultiSelectComponent],
  providers: [ListChangeService, ListModelService]
})
export class MultiSelectModule {}
