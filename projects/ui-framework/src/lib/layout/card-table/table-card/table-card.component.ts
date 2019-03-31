import { Component, Input } from '@angular/core';

import { MetaData, RowData, allowedStyleObj } from '../card-table.interface';
import { generateCellStyle } from '../card-table-utils';

@Component({
  selector: 'b-table-card, [b-table-card]',
  templateUrl: './table-card.component.html',
  styleUrls: ['./table-card.component.scss']
})
export class TableCardComponent {
  constructor() {}

  @Input() meta: MetaData;
  @Input() row: RowData;

  getCellStyle(index: number): allowedStyleObj {
    return generateCellStyle(this.meta, index);
  }
}
