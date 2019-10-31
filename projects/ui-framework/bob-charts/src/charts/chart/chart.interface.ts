import {Options} from 'highcharts';
import {ChartTypesEnum} from './chart.enum';

export class HighChartOptions implements Options {
}
export type LineChartTypes =
  ChartTypesEnum.Area |
  ChartTypesEnum.Line |
  ChartTypesEnum.Spline |
  ChartTypesEnum.Areaspline;

export enum ChartLegendPositionEnum {
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  LEFT = 'left'
}

export enum ChartLegendAlignEnum {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center'
}

export enum ChartLegendVerticalAlignEnum {
  TOP = 'top',
  MIDDLE = 'middle',
  BOTTOM = 'bottom'
}

export enum ChartLegendLayoutEnum {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal'
}
