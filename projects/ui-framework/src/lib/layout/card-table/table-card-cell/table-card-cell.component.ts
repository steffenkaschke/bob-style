import {
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
  OnInit
} from '@angular/core';

import { CardTableCellData, CardTableCellMeta, CardTableCellComponent } from '../card-table.interface';

import { ComponentFactoryService } from '../component-factory.service';

@Component({
  selector: 'b-table-card-cell, [b-table-card-cell]',
  templateUrl: './table-card-cell.component.html',
  styleUrls: ['./table-card-cell.component.scss']
})
export class TableCardCardTableCellComponent implements OnInit {
  constructor(private ComponentFactory: ComponentFactoryService) {}

  @ViewChild('componentHost', { read: ViewContainerRef })
  componentHost: ViewContainerRef;

  @Input() meta: CardTableCellMeta;
  @Input() cell: CardTableCellData;
  @Input() index: number;

  ngOnInit(): void {
    if (this.isComponent(this.cell.data)) {
      this.ComponentFactory.setComponentContainerRef(this.componentHost);
      // this.ComponentFactory.reset();
      this.ComponentFactory.insertComponent(this.cell.data as CardTableCellComponent);
    }
  }

  isString(val: any): boolean {
    return typeof val === 'string';
  }

  isArray(obj: any): boolean {
    return Array.isArray(obj);
  }

  private isComponent(obj: any): boolean {
    return !!obj.component;
  }
}
