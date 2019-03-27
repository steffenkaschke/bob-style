import { Component, Input, HostBinding } from '@angular/core';

import { MetaData, RowData, allowedStyleObj } from '../card-table.interface';

@Component({
  selector: 'b-table-card, [b-table-card]',
  templateUrl: './table-card.component.html',
  styleUrls: ['./table-card.component.scss']
})
export class TableCardComponent {
  constructor() {}

  @Input() meta: MetaData;
  @Input() row: RowData;

  @HostBinding('class') string = 'table-card-row';

  isString(val: any): boolean {
    return typeof val === 'string';
  }

  isArray(obj: any): boolean {
    return Array.isArray(obj);
  }

  getHeaderId(index: number): string {
    return (
      'card-table-title__' +
      index +
      '_' +
      (this.meta[index].id
        ? this.meta[index].id
        : this.meta[index].name.replace(/\s/g, ''))
    );
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
