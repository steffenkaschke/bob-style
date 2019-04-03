import { Component, Input } from '@angular/core';

import {
  CardTableMetaData,
  CardTableRowData,
  cardTableAllowedCellStyles
} from '../card-table.interface';

@Component({
  selector: 'b-table-card, [b-table-card]',
  templateUrl: './table-card.component.html',
  styleUrls: ['./table-card.component.scss']
})
export class TableCardComponent {
  constructor() {}

  @Input() meta: CardTableMetaData;
  @Input() row: CardTableRowData;
  @Input() style: cardTableAllowedCellStyles[];
}
