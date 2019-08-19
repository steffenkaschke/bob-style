import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { TypographyModule } from '../../typography/typography.module';
import { Collapsible2Component } from './collapsible2.component';
import { UtilsModule } from '../../services/utils/utils.module';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';

@NgModule({
  declarations: [Collapsible2Component],
  imports: [CommonModule, TypographyModule, MatExpansionModule, UtilsModule],
  exports: [Collapsible2Component],
  providers: [DOMhelpers, EventManagerPlugins[0]]
})
export class CollapsibleModule {}
