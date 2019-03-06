import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangePicker2Component } from './range-picker2.component';

describe('RangePicker2Component', () => {
  let component: RangePicker2Component;
  let fixture: ComponentFixture<RangePicker2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangePicker2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangePicker2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
