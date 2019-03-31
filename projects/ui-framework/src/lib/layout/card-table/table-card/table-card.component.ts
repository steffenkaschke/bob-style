import { Component, Input } from '@angular/core';

import {
  CardTableMetaData,
  CardTableRowData,
  cardTableAllowedTextStyleObj
} from '../card-table.interface';
import { generateCellStyle } from '../card-table-utils';

@Component({
  selector: 'b-table-card, [b-table-card]',
  templateUrl: './table-card.component.html',
  styleUrls: ['./table-card.component.scss']
})
export class TableCardComponent {
  constructor() {}

  @Input() meta: CardTableMetaData;
  @Input() row: CardTableRowData;

  getCellStyle(index: number): cardTableAllowedTextStyleObj {
    return generateCellStyle(this.meta, index);
  }
}
