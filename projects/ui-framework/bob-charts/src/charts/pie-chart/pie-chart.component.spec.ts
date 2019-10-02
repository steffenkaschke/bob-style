import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import { PieChartComponent } from './pie-chart.component';
import {
  PIE_CHART_DATA_MOCK,
  TOOLTIP_FORMATTER_MOCK_RESULT
} from './pie-chart.mock';
import { ChangeDetectorRef, NgZone } from '@angular/core';
import { ChartCore } from '../chart/chart-core';
import * as Highcharts from 'highcharts';

export class MockNgZone extends NgZone {
  run(fn: Function): any {
    return fn();
  }
}

describe('PieChartComponent', () => {
  let component: PieChartComponent;
  let fixture: ComponentFixture<PieChartComponent>;
  let updatePieOptionsSpy, applyOnChangeSpy, highchartRefSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PieChartComponent],
      providers: [{ provide: [NgZone, ChangeDetectorRef] }]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PieChartComponent);
        component = fixture.componentInstance;
        highchartRefSpy = spyOn(Highcharts, 'chart');
        component.data = PIE_CHART_DATA_MOCK as any;
        component.name = 'fruits';
        fixture.detectChanges();
      });
  }));

  describe('chartCore', () => {
    it('should initialize', () => {
      expect(component).toBeTruthy();
    });
    it('should call ngOnInit', () => {
      updatePieOptionsSpy = spyOn(
        component,
        'updatePieOptions'
      ).and.callThrough();
      component.ngOnInit();
      expect(updatePieOptionsSpy).toHaveBeenCalled();
    });
  });

  describe('chartPie', () => {
    beforeEach(() => {
      spyOn(ChartCore.prototype, 'ngAfterViewInit').and.callThrough();
    });

    it('should call ngAfterViewInit', () => {
      component.ngAfterViewInit();
      expect(ChartCore.prototype.ngAfterViewInit).toHaveBeenCalled();
    });
    it('should call updatePieOptions', () => {
      updatePieOptionsSpy = spyOn(
        component,
        'updatePieOptions'
      ).and.callThrough();
      component.ngOnInit.call(component);
      expect(updatePieOptionsSpy).toHaveBeenCalled();
    });
    it('should format value, apply color, add pre and post values', () => {
      updatePieOptionsSpy = spyOn(
        component,
        'updatePieOptions'
      ).and.callThrough();
      component.ngOnInit.call(component);
      component.preTooltipValue = 'ILS ';
      component.postTooltipValue = ' end';
      component.tooltipValueFormatter = val => `formatted ${val / 1000}`;
      expect(
        component.tooltipFormatter(
          {
            color: 'red',
            y: 48000,
            key: 'balloons'
          },
          component
        )
      ).toEqual(TOOLTIP_FORMATTER_MOCK_RESULT);
    });
    describe('ngOnChanges', () => {
      beforeEach(() => {
        updatePieOptionsSpy = spyOn(component, 'updatePieOptions');
        applyOnChangeSpy = spyOn(ChartCore.prototype, 'applyOnChange');
        component.ngOnChanges.call(component);
        fixture.detectChanges();
      });
      it('should call updatePieOptions and applyOnChangeSpy', () => {
        expect(updatePieOptionsSpy).toHaveBeenCalled();
        expect(applyOnChangeSpy).toHaveBeenCalled();
      });
      it('should highchart update with options', () => {
        expect(highchartRefSpy).toHaveBeenCalledWith(
          component.containerId,
          component.options
        );
      });
      it('should inputs be same as highchart options properties', () => {
        expect(component.options.series[0].name).toEqual('fruits');
        expect((component.options.series[0] as any).data).toEqual(
          PIE_CHART_DATA_MOCK
        );
        expect(component.options.chart.type).toEqual('pie');
        expect(component.type).toEqual('pie');
        expect(component.legend).toEqual(
          component.options.plotOptions[component.type].showInLegend
        );
      });
    });
  });
});