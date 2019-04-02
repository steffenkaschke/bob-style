import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableCardCardTableCellComponent } from './table-card-cell/table-card-cell.component';
import { TableCardComponent } from './table-card/table-card.component';
import { CardTableComponent } from './card-table/card-table.component';

import { ComponentRendererComponent } from '../../services/component-renderer/component-renderer.component';

@NgModule({
  declarations: [
    TableCardCardTableCellComponent,
    TableCardComponent,
    CardTableComponent,
    ComponentRendererComponent
  ],
  imports: [CommonModule],
  exports: [
    TableCardCardTableCellComponent,
    TableCardComponent,
    CardTableComponent
  ],
  providers: []
})
export class CardTableModule {}
