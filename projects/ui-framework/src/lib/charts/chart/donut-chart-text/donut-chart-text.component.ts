import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Options, SeriesPieDataOptions} from 'highcharts';

@Component({
  selector: 'b-donut-text-chart',
  templateUrl: './donut-chart-text.component.html',
  styleUrls: [
    './donut-chart-text.component.scss'
    ]
})
export class DonutChartTextComponent implements OnInit, OnChanges {
  textStyle: any;
  @Input() data: Array<(number|[string, (number|null)]|null|SeriesPieDataOptions)>;
  @Input() name: string;
  @Input() donutInnerSize = 80;
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
  @Input() height = 250;
  @Input() title: string = null;
  @Input() legend = false;
  @Input() showDataLabels = false;
  @Input() pointFormat = '{series.name}: <b>{point.percentage:.1f}%</b>';
  @Input() extraOptions: Options = {};
  constructor(
  ) {
  }
  ngOnInit(): void {
    this.setTextStyle();
  }

  ngOnChanges(): void {
    this.setTextStyle();
  }

  private setTextStyle () {
    const donutSize = this.maxDonutTextSize();
    this.textStyle = {
      lineHeight: `${donutSize}px`,
      width: `${donutSize}px`,
      height: `${donutSize}px`
    };
  }

  private maxDonutTextSize() {
    return Math.min(Math.abs(this.donutInnerSize) + 1, this.height - 50);
  }
}
