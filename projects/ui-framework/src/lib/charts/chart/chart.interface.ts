import {Options} from 'highcharts';

export interface ChartOptions {
  height?: number;
  title?: string;
  legend?: boolean;
  showDataLabels?: boolean;
  pointFormat?: string;
  extraOptions?: Options;
}
