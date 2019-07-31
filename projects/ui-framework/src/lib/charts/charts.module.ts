import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsModule } from '../services/utils/utils.module';
import { PieChartComponent } from './pie-chart/pie-chart.component';

@NgModule({
  declarations: [
    PieChartComponent
  ],
  imports: [
    CommonModule,
    UtilsModule,
  ],
  exports: [
    PieChartComponent
  ]
})
export class ChartsModule {
}
