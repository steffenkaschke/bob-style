import { Component, OnInit, ViewChild, Input, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { ColumnConfig } from '../table/column-config';

@Component({
  selector: 'b-table-cell',
  templateUrl: './table-cell.component.html',
  styleUrls: ['./table-cell.component.scss']
})
export class TableCellComponent implements OnInit {

  @ViewChild('container', {read: ViewContainerRef}) cellHost: ViewContainerRef;

  @Input() row: object;
  @Input() column: ColumnConfig;
  @Input() data: any;

  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.initCell();
  }

  initCell() {
    const cellComponent = this.column.component.component;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(cellComponent);
    const viewContainerRef = this.cellHost;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);

    const cell = componentRef.instance as any;
    cell.row = this.row;
    cell.column = this.column;
    cell.data = this.data;
  }

}
