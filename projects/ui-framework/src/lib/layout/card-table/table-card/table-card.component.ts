import { Component, Input, Output, EventEmitter } from '@angular/core';

import {
  CardTableMetaData,
  CardTableRowData,
  cardTableAllowedCellStyles,
  CardTableCellData
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
  @Input() style: cardTableAllowedCellStyles[];
  @Output() cellClicked?: EventEmitter<CardTableCellData> = new EventEmitter<
    CardTableCellData
  >();

  onCellClicked(cell: CardTableCellData): void {
    this.cellClicked.emit(cell);
  }
}
