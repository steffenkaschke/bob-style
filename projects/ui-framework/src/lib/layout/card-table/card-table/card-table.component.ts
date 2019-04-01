import { Component, Input, HostBinding, OnInit } from '@angular/core';

import {
  CardTableMetaData,
  CardTableData,
  cardTableAllowedCellStyleObj
} from '../card-table.interface';

@Component({
  selector: 'b-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.scss']
})
export class CardTableComponent implements OnInit {
  constructor() {}

  @Input() meta: CardTableMetaData;
  @Input() table: CardTableData;
  @Input() minCellWidth = 5;

  @HostBinding('attr.role') string = 'table';

  cellsStyle: cardTableAllowedCellStyleObj[];

  private getCellsWidth(): number[] {
    let cellWidths: number[] = [];

    const maxCellWidth = 100 - this.minCellWidth * (this.meta.length - 1);
    const autoWidthCellsNumber = this.meta.reduce(
      (acc, cell) => (cell.width > 0 ? acc : acc + 1),
      0
    );
    const totalProvidedWidth = this.meta.reduce(
      (acc, cell) => (cell.width > 0 ? acc + cell.width : acc),
      0
    );

    cellWidths = this.meta.map(cell => {
      const autoWidth = (100 - totalProvidedWidth) / autoWidthCellsNumber;

      return cell.width > 0
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
      Math.round(cellWidths.reduce((acc, width) => acc + width, 0));

    const cellsBiggerThanMinimum = () =>
      cellWidths.reduce(
        (acc, width) => (width > this.minCellWidth ? acc + 1 : acc), 0);

    while (totalWidth() > 100) {
      cellWidths = cellWidths.map(width => {
        const target = width - (totalWidth() - 100) / cellsBiggerThanMinimum();
        return target > this.minCellWidth ? target : width;
      });
    }

    if (totalWidth() < 100) {
      cellWidths = cellWidths.map(
        width => width + (100 - totalWidth()) / cellWidths.length
      );
    }

    return cellWidths;
  }

  private setCellsStyle(): void {
    const cellsWidths = this.getCellsWidth();

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
