import { Component, Input, HostBinding } from '@angular/core';

import { RowData } from '../card-table.interface';

@Component({
  selector: 'b-table-card',
  templateUrl: './table-card.component.html',
  styleUrls: ['./table-card.component.scss']
})
export class TableCardComponent {
  constructor() {}

  @Input() rowData: RowData;

  isString(val) {
    return typeof val === 'string';
  }

  isArray(obj: any) {
    return Array.isArray(obj);
  }
}
