import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCardComponent } from './table-card/table-card.component';
import { CardTableComponent } from './card-table/card-table.component';

@NgModule({
  declarations: [TableCardComponent, CardTableComponent],
  imports: [CommonModule],
  exports: [TableCardComponent, CardTableComponent],
  providers: []
})
export class CardTableModule {}
