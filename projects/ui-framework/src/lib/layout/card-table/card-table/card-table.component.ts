import { Component, Input, HostBinding, OnInit } from '@angular/core';

import {
  CardTableMetaData,
  CardTableData,
  cardTableAllowedCellStyleObj
} from '../card-table.interface';
import { CellWidthsService } from '../cell-widths.service';

@Component({
  selector: 'b-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.scss']
})
export class CardTableComponent implements OnInit {
  constructor(private CellWidthsService: CellWidthsService) {}

  @Input() meta: CardTableMetaData;
  @Input() table: CardTableData;
  @Input() minCellWidth = 5;

  @HostBinding('attr.role') string = 'table';

  cellsStyle: cardTableAllowedCellStyleObj[];

  private setCellsStyle(): void {
    const cellsWidths = this.CellWidthsService.getCellsWidth(
      this.meta,
      this.minCellWidth
    );

    this.cellsStyle = this.meta.map((cell, index) => ({
      maxWidth: cellsWidths[index] + '%',
      alignItems: cell.align === 'right' ? 'flex-end' : null,
      ...cell.textStyle
    }));
  }

  ngOnInit(): void {
    this.setCellsStyle();
  }
}
