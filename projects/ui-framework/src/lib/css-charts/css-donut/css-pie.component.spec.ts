import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CssPieComponent } from './css-pie.component';

describe('CssDonutComponent', () => {
  let component: CssPieComponent;
  let fixture: ComponentFixture<CssPieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CssPieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CssPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
