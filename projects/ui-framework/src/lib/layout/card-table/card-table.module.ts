import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCardComponent } from './table-card/table-card.component';

@NgModule({
  declarations: [TableCardComponent],
  imports: [CommonModule],
  exports: [TableCardComponent],
  providers: []
})
export class CardTableModule {}
