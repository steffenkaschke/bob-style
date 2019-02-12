import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCellComponent } from './table-cell.component';
import { mockColumns } from '../../table/table.mock';

describe('TableCellComponent', () => {
  let component: TableCellComponent;
  let fixture: ComponentFixture<TableCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableCellComponent ],
      providers: [],
    })
    .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(TableCellComponent);
    component = fixture.componentInstance;
    component.column = mockColumns[0];
    fixture.detectChanges();
    component.ngOnInit();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
