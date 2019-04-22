import { Component, Input, Output, EventEmitter } from '@angular/core';

import {
  CardTableMetaData,
  CardTableRowData,
  cardTableAllowedCellStyles,
  CardTableCellData,
  CardTableCellClickEvent
} from '../card-table.interface';

@Component({
  selector: 'b-table-card, [b-table-card]',
  templateUrl: './table-card.component.html',
  styleUrls: ['./table-card.component.scss']
})
export class TableCardComponent {
  constructor() {}

  @Input() meta: CardTableMetaData;
  @Input() row: CardTableRowData;
  @Input() rowIndex: number;
  @Input() style: cardTableAllowedCellStyles[];
  @Output() cellClicked?: EventEmitter<
    CardTableCellClickEvent
  > = new EventEmitter<CardTableCellClickEvent>();

  onCellClicked(cell: CardTableCellData, index: number): void {
    this.cellClicked.emit({
      cell: cell,
      cellIndex: index,
      rowIndex: this.rowIndex
    });
  }
}
