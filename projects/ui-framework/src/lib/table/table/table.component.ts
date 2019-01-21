import { Component, OnInit, Input, EventEmitter, Output, ComponentFactoryResolver } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ColumnConfig } from './column-config';
import { SelectionModel } from '@angular/cdk/collections';
import { DomSanitizer } from '@angular/platform-browser';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'b-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input() dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  @Input() displayedColumns: ColumnConfig[] = [];
  @Input() multiSelect = false;
  @Input() sortInit = {};
  @Input() selectedRowInit = {};

  @Output() sort: EventEmitter<any> = new EventEmitter<any>();
  @Output() loadMore: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() selected: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() columnFiltered: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowRightClicked: EventEmitter<any> = new EventEmitter<any>();
  activeSort: ColumnConfig = null;


  selection: SelectionModel<any>;
  col = [];


  constructor(private sanitizer: DomSanitizer,
    private cfr: ComponentFactoryResolver) { }

  ngOnInit() {

    this.col = this.displayedColumns.map((x: ColumnConfig) => x.name);
    if (true) {
      this.col.unshift('select');
    }

    const initialSelection = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<any>(allowMultiSelect, initialSelection);

    this.activeSort = this.displayedColumns.find((x) => x.sortActive !== null);

  }

  sortData(event) {
    this.sort.emit(event);
  }



  clearFilters() {

  }

  onSelectRow(event, row) {
    if (event) {
      this.selection.toggle(row);
    }

    this.selected.emit(this.selection.selected);

  }

  onSelectMaster(event) {
    if (event) {
      this.masterToggle();
    }
    this.selected.emit(this.selection.selected);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  rowClick(row) {
    this.rowClicked.emit(row);
  }

  onColumnFilter(column, option, event) {
    const colIndex = this.displayedColumns.indexOf(column);
    if (colIndex > -1) {
      const optionIndex = this.displayedColumns[colIndex].options.indexOf(option);
      this.displayedColumns[colIndex].options[optionIndex].selected = event.checked;
    }

    this.columnFiltered.emit({ column: column.name, option: option.name, checked: event.checked });
  }

  sanitize(element) {
    return this.sanitizer.bypassSecurityTrustHtml(element);
  }

  rightClick(row) {
    this.rowRightClicked.emit(row);
  }

  removeColumnClicked(column) {
    this.col = this.col.filter((x) => x !== column.name);
  }

  drop(event: CdkDragDrop<ColumnConfig>) {
    console.log(event);
    moveItemInArray(this.col, event.previousIndex, event.currentIndex);
  }

}
