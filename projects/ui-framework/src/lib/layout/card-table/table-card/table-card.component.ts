import { Component, Input } from '@angular/core';

import { MetaData, RowData, allowedStyleObj } from '../card-table.interface';
import { genId } from '../card-table-utils';

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
    return genId(this.meta, index, 'card-table-title__');
  }

  getCellId(index: number): string {
    return genId(this.meta, index, 'card-table-cell__');
  }

  private checkCssUnit(value: string): string {
    const n = parseFloat(value),
      p = value.match(/%|em|rem/);
    return isNaN(n) ? 'auto' : p ? n + '' + p : Math.round(n) + 'px';
  }

  getCellWidth(index: number): string | null {
    if (!this.meta[index].width || this.meta[index].width === 'auto') {
      return null;
    }
    return this.checkCssUnit(String(this.meta[index].width));
  }

  getCellStyle(index: number): allowedStyleObj {
    return {
      maxWidth: this.getCellWidth(index),
      ...this.meta[index].style
    };
  }
}
