import { Component, Input } from '@angular/core';

import {
  CardTableCellData,
  CardTableCellDataType
} from '../card-table.interface';
import { RenderedComponent } from '../../../services/component-renderer/component-renderer.interface';

@Component({
  selector: 'b-table-card-cell, [b-table-card-cell]',
  templateUrl: './table-card-cell.component.html',
  styleUrls: ['./table-card-cell.component.scss']
})
export class TableCardCellComponent {
  constructor() {}

  @Input() cell: CardTableCellData;
  @Input() index: number;

  isString(val: CardTableCellDataType): boolean {
    return val && typeof val === 'string';
  }

  isArray(val: CardTableCellDataType): boolean {
    return val && Array.isArray(val);
  }

  isComponent(obj: any): boolean {
    return obj && !!obj.component;
  }

  onComponentClick($event: any, cell: CardTableCellDataType): void {
    if ((cell as RenderedComponent).handlers) {
      $event.stopPropagation();
    }
  }
}
