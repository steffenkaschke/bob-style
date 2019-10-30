import {ChangeDetectorRef, Component, Input, NgZone, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ChartCore} from '../chart/chart-core';
import {ChartTypesEnum} from '../chart/chart.enum';
import {SeriesPieDataOptions} from 'highcharts';

@Component({
  selector: 'b-line-chart',
  templateUrl: '../chart/chart.component.html',
  styleUrls: [
    '../chart/chart.component.scss'
  ]
})
export class LineChartComponent extends ChartCore implements OnInit, OnChanges  {
  @Input() type: ChartTypesEnum.Area | ChartTypesEnum.Line | ChartTypesEnum.Spline = ChartTypesEnum.Line;
  @Input() data: Array<(number|[string, (number|null)]|null|SeriesPieDataOptions)>;
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
    this.extraOptions = {
      chart: {
        height: Math.abs(this.height)
      },
      plotOptions: {
        [this.type]: {
        }
      },
      series: [
        {
          type: this.type as any,
          name: this.name,
          data: this.data
        }
      ]
    };
  }
}
