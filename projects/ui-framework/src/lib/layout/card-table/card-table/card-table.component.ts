import { Component, Input, HostBinding } from '@angular/core';

import {
  CardTableMetaData,
  CardTableData,
  cardTableAllowedTextStyleObj
} from '../card-table.interface';

import { generateCellStyle } from '../card-table-utils';

@Component({
  selector: 'b-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.scss']
})
export class CardTableComponent {
  constructor() {}

  @Input() meta: CardTableMetaData;
  @Input() table: CardTableData;

  @HostBinding('attr.role') string = 'table';

  getCellStyle(index: number): cardTableAllowedTextStyleObj {
    return generateCellStyle(this.meta, index, false);
  }
}
