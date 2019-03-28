import { Component, Input, HostBinding } from '@angular/core';

import { CardTableData } from '../card-table.interface';

import { genId } from '../card-table-utils';

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
    return genId(this.table.meta, index, 'card-table-title__');
  }
}
