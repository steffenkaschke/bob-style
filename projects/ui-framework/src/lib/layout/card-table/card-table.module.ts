import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCardCardTableCellComponent } from './table-card-cell/table-card-cell.component';
import { TableCardComponent } from './table-card/table-card.component';
import { CardTableComponent } from './card-table/card-table.component';

import { ComponentFactoryService } from './component-factory.service';

@NgModule({
  declarations: [
    TableCardCardTableCellComponent,
    TableCardComponent,
    CardTableComponent
  ],
  imports: [CommonModule],
  exports: [
    TableCardCardTableCellComponent,
    TableCardComponent,
    CardTableComponent
  ],
  providers: [ComponentFactoryService]
})
export class CardTableModule {}
