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

  // @HostBinding('class') string = 'table-card-row';

  // getHeaderId(index: number): string {
  //   return (
  //     'card-table-title__' +
  //     index +
  //     '_' +
  //     (this.meta[index].id
  //       ? this.meta[index].id
  //       : this.meta[index].name.replace(/\s/g, ''))
  //   );
  // }
}
