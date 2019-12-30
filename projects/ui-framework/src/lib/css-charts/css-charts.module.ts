import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CssPieComponent } from './css-donut/css-pie.component';

@NgModule({
  declarations: [CssPieComponent],
  imports: [
    CommonModule
  ],
  exports: [CssPieComponent]
})
export class CssChartsModule { }
