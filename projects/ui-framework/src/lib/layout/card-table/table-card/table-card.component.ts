import { Component, Input } from '@angular/core';

import { MetaData, RowData, allowedStyleObj } from '../card-table.interface';
import { generateCellId, generateCellStyle } from '../card-table-utils';

@Component({
  selector: 'b-table-card, [b-table-card]',
  templateUrl: './table-card.component.html',
  styleUrls: ['./table-card.component.scss']
})
export class TableCardComponent {
  constructor() {}

  @Input() meta: MetaData;
  @Input() row: RowData;

  getHeaderId(index: number): string {
    return generateCellId(this.meta, index, 'card-table-title__');
  }

  getCellId(index: number): string {
    return generateCellId(this.meta, index, 'card-table-cell__');
  }

  getCellStyle(index: number): allowedStyleObj {
    return generateCellStyle(this.meta, index);
  }
}
