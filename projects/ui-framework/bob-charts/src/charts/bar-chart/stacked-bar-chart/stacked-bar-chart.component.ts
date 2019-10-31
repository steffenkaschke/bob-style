import {ChangeDetectorRef, Component, Input, NgZone, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ChartTypesEnum} from '../../chart/chart.enum';
import {SeriesColumnOptions, SeriesPieDataOptions} from 'highcharts';
import {ChartCore} from '../../chart/chart-core';

@Component({
  selector: 'b-stacked-bar-chart',
  templateUrl: '../../chart/chart.component.html',
  styleUrls: [
    '../../chart/chart.component.scss',
    './stacked-bar-chart.component.scss'
  ]
})
export class StackedBarChartComponent extends ChartCore implements OnInit, OnChanges {
  type = ChartTypesEnum.Column;
  @Input() categories: string[];
  @Input() data: SeriesColumnOptions[];
  @Input() name: string;
  constructor(
    public zone: NgZone,
    public cdr: ChangeDetectorRef
  ) {
    super(zone, cdr);
    this.height = 450;
  }

  ngOnInit() {
    this.updatePieOptions();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.updatePieOptions();
    this.applyOnChange();
  }

  private updatePieOptions() {
    this.chartOptions = {
      chart: {
        height: Math.abs(this.height)
      },
      xAxis: {
        categories: this.categories
      },
      plotOptions: {
        column: {
          stacking: 'normal'
        }
      },
      series: this.data
    };
  }

}
