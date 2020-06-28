import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RteViewComponent } from './rte-view.component';
import { PlaceholdersConverterService } from '../../../../bob-rte/src/rte/placeholders.service';

@NgModule({
  declarations: [RteViewComponent],
  imports: [CommonModule],
  exports: [RteViewComponent],
  providers: [PlaceholdersConverterService],
})
export class RteViewModule {}
