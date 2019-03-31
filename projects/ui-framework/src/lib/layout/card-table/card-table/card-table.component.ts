import { Component, Input, HostBinding, OnInit } from '@angular/core';

import {
  CardTableMetaData,
  CardTableData,
  cardTableAllowedTextStyleObj
} from '../card-table.interface';

import { generateCellStyle } from '../card-table-utils';

@Component({
  selector: 'b-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.scss']
})
export class CardTableComponent implements OnInit {
  constructor() {}

  @Input() meta: CardTableMetaData;
  @Input() table: CardTableData;
  @Input() minCellWidth = 0;

  @HostBinding('attr.role') string = 'table';

  cellWidths: number[] = [];

  private setCellsWidth(): void {

    const maxCellWidth = 100 - this.minCellWidth * (this.meta.length - 1);
    const autoWidthCellsNumber = this.meta.reduce((acc, cell) => cell.width ? acc : acc + 1, 0);
    const totalProvidedWidth = this.meta.reduce((acc, cell) => cell.width ? acc + cell.width : acc, 0);

    this.cellWidths = this.meta.map(cell => {
      const autoWidth = (100 - totalProvidedWidth) / autoWidthCellsNumber;

      return cell.width
        ? cell.width > this.minCellWidth
          ? cell.width > maxCellWidth
            ? maxCellWidth
            : cell.width
          : this.minCellWidth
        : autoWidth > this.minCellWidth
          ? autoWidth
          : this.minCellWidth;
    });

    const totalWidth = () =>
      Math.round(this.cellWidths.reduce((acc, width) => acc + width, 0));

    const cellsBiggerThanMinimum = () =>
      this.cellWidths.reduce((acc, width) => width > this.minCellWidth ? acc + 1 : acc, 0);

    while (totalWidth() > 100) {
      this.cellWidths = this.cellWidths.map(width => {
        const target =
          width - (totalWidth() - 100) / cellsBiggerThanMinimum();
        return target > this.minCellWidth ? target : width;
      });
    }

  }

  ngOnInit(): void {
    this.setCellsWidth();
    console.log(this.cellWidths);
  }

  getCellStyle(index: number): cardTableAllowedTextStyleObj {
    return generateCellStyle(this.meta, index, false);
  }
}
