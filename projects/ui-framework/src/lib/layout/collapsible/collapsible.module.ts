import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { TypographyModule } from '../../typography/typography.module';
import { CollapsibleComponent } from './collapsible.component';
import { UtilsModule } from '../../services/utils/utils.module';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';

@NgModule({
  declarations: [CollapsibleComponent],
  imports: [CommonModule, TypographyModule, MatExpansionModule, UtilsModule],
  exports: [CollapsibleComponent],
  providers: [DOMhelpers]
})
export class CollapsibleModule {}
