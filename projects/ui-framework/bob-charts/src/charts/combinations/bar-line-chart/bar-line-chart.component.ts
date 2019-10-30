import {ChangeDetectorRef, Component, Input, NgZone, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ChartCore} from '../../chart/chart-core';
import {Options, SeriesOptionsType} from 'highcharts';

@Component({
  selector: 'b-bar-line-chart',
  templateUrl: '../../chart/chart.component.html',
  styleUrls: ['../../chart/chart.component.scss']
})
export class BarLineChartComponent extends ChartCore implements OnInit, OnChanges {
  type = null;
  @Input() categories: string[];
  @Input() data: SeriesOptionsType[];
  @Input() name: string;
  @Input() extras: Options = {};
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
    this.extraOptions = {
      chart: {
        height: Math.abs(this.height)
      },
      xAxis: {
        categories: this.categories
      },
      series: this.data,
      ...this.extras
    };
  }

}
