import { Component, Input, HostBinding } from '@angular/core';

import { CardTableData, allowedStyleObj } from '../card-table.interface';

import { generateCellId, generateCellStyle } from '../card-table-utils';

@Component({
  selector: 'b-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.scss']
})
export class CardTableComponent {
  constructor() {}

  @Input() table: CardTableData;

  @HostBinding('attr.role') string = 'table';

  getHeaderId(index: number): string {
    return generateCellId(this.table.meta, index, 'card-table-title__');
  }

  getCellStyle(index: number): allowedStyleObj {
    return generateCellStyle(this.table.meta, index, false);
  }
}
