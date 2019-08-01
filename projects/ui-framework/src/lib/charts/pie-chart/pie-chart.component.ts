import {ChangeDetectorRef, Component, Input, NgZone, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ChartCore} from '../chart/chart-core';
import {ChartTypesEnum} from '../chart/chart.enum';
import {SeriesPieDataOptions} from 'highcharts';

export const minDonutWidth = 3, pieLegendHeight = 37, piePadding = 50;
@Component({
  selector: 'b-pie-chart',
  templateUrl: '../chart/chart.component.html',
  styleUrls: [
    '../chart/chart.component.scss',
    './pie-chart.component.scss']
})
export class PieChartComponent extends ChartCore implements OnInit, OnChanges {
  @Input() data: Array<(number|[string, (number|null)]|null|SeriesPieDataOptions)>;
  // @Input() pieOptions: PieOptions = {
  //   donut: false,
  //   donutInnerSize: 60
  // };

  @Input() innerText: string;
  @Input() name: string;
  @Input() donut = false;
  @Input() donutInnerSize = 60;
  @Input() donutWidth: number;
  type = ChartTypesEnum.Pie;
  constructor(
    protected zone: NgZone,
    protected cdr: ChangeDetectorRef
  ) {
    super(zone, cdr);
  }
  ngOnInit(): void {
    this.updatePieOptions();
    super.initialOptions();
  }

  updatePieOptions() {
    this.extraOptions = {
      chart: {
        height: Math.abs(this.height)
      },
      plotOptions: {
        pie: {
          innerSize: null,
          depth: null
        }
      },
      series: [
        {
          type: 'pie',
          name: this.name,
          data: this.data
        }
      ]
    };
    if (this.donut) {
      this.extraOptions.plotOptions.pie.innerSize = Math.min(
        Math.abs(this.donutInnerSize),
        this.setInnerSize(piePadding)
      );
    }
    if (this.donut && this.donutWidth) {
      this.extraOptions.plotOptions.pie.innerSize = Math.max(
        0,
          this.setInnerSize(piePadding - minDonutWidth + Math.abs(this.donutWidth))
      );
    }
  }

  private setInnerSize(offset: number) {
    return this.legend
      ? Math.abs(this.height) - pieLegendHeight - offset
      : Math.abs(this.height) - offset;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updatePieOptions();
    super.ngOnChanges(changes);
  }
}
