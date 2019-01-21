import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import {
  MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule, MatInputModule,
  MatCheckboxModule, MatMenuModule
} from '@angular/material';
import { TableCellComponent } from './table-cell/table-cell.component';

@NgModule({
  declarations: [TableComponent, TableCellComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatMenuModule
  ],
  exports: [TableComponent]
})
export class TableModule { }
