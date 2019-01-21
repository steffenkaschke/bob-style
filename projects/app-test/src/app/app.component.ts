import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ColumnConfig, filedType, sortDirections } from 'projects/ui-framework/src/lib/table/table/column-config';
import { TestComponent } from './test/test.component';

export interface DataType {
  product: string;
  description: string;
}

export const data = [
  {
    product: 'Mouse',
    description: 'Fast and wireless',
    experiment: '',
    status: 'pending'
  },
  {
    product: 'Keyboard',
    description: 'Loud and Mechanical',
    experiment: '',
    status: 'pending'
  },
  {
    product: 'Laser',
    description: 'It\'s bright',
    experiment: 'bla bla',
    status: 'pending'
  },
  {
    product: 'Baby food',
    description: 'It\'s good for you',
    experiment: 'bla bla',
    stauts: 'published'
  },
  {
    product: 'Coffee',
    description: 'Prepared from roasted coffee beans',
    experiment: 'bla bla',
    stauts: 'published'
  },
  {
    product: 'Cheese',
    description: 'A dairy product',
    experiment: { data: { itay: 'bla bla' } },
    stauts: 'published'
  }
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  columns: ColumnConfig[] = [
    {
      name: 'product',
      displayName: 'Product',
      type: filedType.string,
      isSort: true,
      sortActive: sortDirections.asc
    },
    {
      name: 'description',
      displayName: 'Description',
      type: filedType.string,
    },
    {
      name: 'experiment',
      displayName: 'Experiment',
      type: filedType.component,
      component: { component: TestComponent, data: { itay: 'bla bla' } }
    },
    {
      name: 'status',
      displayName: 'Status',
      type: filedType.enum,
      options: [
        { name: 'draft', displayName: 'Draft', selected: false },
        { name: 'pending', displayName: 'Pending', selected: true }
      ]
    }
  ];

  data: MatTableDataSource<DataType> = new MatTableDataSource(data);

  ngOnInit(): void {
    console.log(this.columns);
  }


  selected(selected) {
    console.log(selected);
  }

  onSort(event) {
    console.log(event);
  }

  rowClicked(event) {
    console.log(event);
  }

  onColumnFiltered(event) {
    console.log(this.columns);
    console.log(event);
  }

  rowRightClicked(event) {
    console.log(event);
  }

  revmoveColumn(event) {
    this.columns = this.columns.filter(x => x.name !== event.name);
  }
}
