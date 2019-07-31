import {ChangeDetectorRef, Component, Input, NgZone, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ChartCore} from '../chart/chart-core';
import {ChartTypesEnum} from '../chart/chart.enum';
import {SeriesOptionsType} from 'highcharts';

export interface Interface {
  somethingHere(): void;
}

export const minDonutWidth = 3, pieLegendHeight = 37, piePadding = 50;

@Component({
  selector: 'b-pie-chart',
  templateUrl: '../chart/chart.component.html',
  styleUrls: [
    '../chart/chart.component.scss',
    './pie-chart.component.scss']
})
export class PieChartComponent extends ChartCore implements OnInit, OnChanges {
  @Input() name: string;
  @Input() data: any;
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
        height: this.height
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
        this.donutInnerSize,
        this.setInnerSize(piePadding)
      );
    }
    if (this.donutWidth) {
      this.extraOptions.plotOptions.pie.innerSize = Math.max(
        0,
          this.setInnerSize(piePadding - minDonutWidth + Math.abs(this.donutWidth))
      );
      console.log(this.extraOptions.plotOptions.pie.innerSize);
    }
  }

  private setInnerSize(offset: number) {
    console.log('this.legend:', this.legend ,this.legend
      ? this.height - pieLegendHeight - offset
      : this.height - offset);
    return this.legend
      ? this.height - pieLegendHeight - offset
      : this.height - offset;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updatePieOptions();
    super.ngOnChanges(changes);
  }
}
