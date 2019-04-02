import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentRendererComponent } from './component-renderer.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ComponentRendererComponent],
  exports: [ComponentRendererComponent]
})
export class ComponentRendererModule {}
