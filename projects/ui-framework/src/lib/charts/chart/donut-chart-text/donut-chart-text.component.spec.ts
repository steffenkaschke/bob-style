import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {DonutChartTextComponent} from './donut-chart-text.component';

describe('DonutC', () => {
  let component: DonutChartTextComponent;
  let fixture: ComponentFixture<DonutChartTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonutChartTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonutChartTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
