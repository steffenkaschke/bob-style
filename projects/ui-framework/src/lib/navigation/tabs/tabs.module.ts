import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './tabs.component';
import { MatTabsModule } from '@angular/material/tabs';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';

@NgModule({
  declarations: [TabsComponent],
  imports: [CommonModule, MatTabsModule],
  exports: [TabsComponent],
  providers: [EventManagerPlugins[0]]
})
export class TabsModule {}
