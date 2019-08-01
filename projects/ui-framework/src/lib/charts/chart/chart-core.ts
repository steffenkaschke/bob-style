import {AfterViewInit, ChangeDetectorRef, Input, NgZone, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as Highcharts from 'highcharts';
import {Options} from 'highcharts';
import {ChartTypesEnum} from './chart.enum';
import {merge} from 'lodash';
import {simpleUID} from '../../services/utils/functional-utils';

declare var require: any;
const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

export abstract class ChartCore implements AfterViewInit, OnInit, OnChanges {
  abstract type: ChartTypesEnum;
  highChartRef: any;
  containerId: string = simpleUID();
  options: Options;
  // @Input() chartOptions: ChartOptions = {
  //   height: 700,
  //   title: null,
  //   legend: false,
  //   showDataLabels: false,
  //   pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
  //   extraOptions: {}
  // };
  @Input() colorPalette: string[] = [
    '#058DC7',
    '#50B432',
    '#ED561B',
    '#DDDF00',
    '#24CBE5',
    '#64E572',
    '#FF9655',
    '#FFF263',
    '#6AF9C4'];
  @Input() height = 500;
  @Input() title: string = null;
  @Input() legend = false;
  @Input() showDataLabels = false;
  @Input() pointFormat = '{series.name}: <b>{point.percentage:.1f}%</b>';
  @Input() extraOptions: Options = {};

  protected constructor(
    protected zone: NgZone,
    protected cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.initialOptions();
  }

  initialOptions(): void {
    this.options = merge({
      chart: {
        height: this.height,
        type: this.type
      },
      title: {
        text: this.title,
      },
      tooltip: {
        outside: true
      },
      plotOptions: {
        [this.type]: {
          showInLegend: this.legend,
          dataLabels: {
            enabled: this.showDataLabels
          },
          tooltip: {
            pointFormat: this.pointFormat
          }
        }
      },
      credits: {
        enabled: false
      },
      series: [],
    }, this.extraOptions);
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      Highcharts.setOptions({
        colors: this.colorPalette
      });
      this.highChartRef = Highcharts.chart(this.containerId, this.options);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (this.highChartRef) {
      this.cdr.markForCheck();
      this.initialOptions();
      this.highChartRef.update(this.options);
    }
  }
}
