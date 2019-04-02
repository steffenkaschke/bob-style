import { Component, Input } from '@angular/core';

import { CardTableCellData, CardTableCellMeta } from '../card-table.interface';

@Component({
  selector: 'b-table-card-cell, [b-table-card-cell]',
  templateUrl: './table-card-cell.component.html',
  styleUrls: ['./table-card-cell.component.scss']
})
export class TableCardCardTableCellComponent {
  constructor() {}

  @Input() meta: CardTableCellMeta;
  @Input() cell: CardTableCellData;
  @Input() index: number;

  isString(val: any): boolean {
    return typeof val === 'string';
  }

  isArray(obj: any): boolean {
    return Array.isArray(obj);
  }

  isComponent(obj: any): boolean {
    return !!obj.component;
  }
}
