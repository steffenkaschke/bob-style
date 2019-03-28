import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCardCellComponent } from './table-card-cell/table-card-cell.component';
import { TableCardComponent } from './table-card/table-card.component';
import { CardTableComponent } from './card-table/card-table.component';

import { ComponentFactoryService } from './component-factory.service';

import { ChipsModule } from '../../buttons-indicators/chips/chips.module';

import { ChipComponent } from '../../buttons-indicators/chips/chip/chip.component';

@NgModule({
  declarations: [
    TableCardCellComponent,
    TableCardComponent,
    CardTableComponent
  ],
  entryComponents: [ChipComponent],
  imports: [CommonModule, ChipsModule],
  exports: [TableCardCellComponent, TableCardComponent, CardTableComponent],
  providers: [ComponentFactoryService]
})
export class CardTableModule {}
