import { Component, Input, HostBinding } from '@angular/core';

import { CardTableData } from '../card-table.interface';

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
    return (
      'card-table-title__' +
      index +
      '_' +
      (this.table.meta[index].id
        ? this.table.meta[index].id
        : this.table.meta[index].name.replace(/\s/g, ''))
    );
  }
}
