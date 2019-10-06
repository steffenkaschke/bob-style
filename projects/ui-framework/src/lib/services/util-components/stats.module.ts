import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsComponent } from './stats.component';
import { EventManagerPlugins } from '../utils/eventManager.plugins';

@NgModule({
  imports: [CommonModule],
  declarations: [StatsComponent],
  exports: [StatsComponent],
  providers: [EventManagerPlugins[0]]
})
export class StatsModule {}
