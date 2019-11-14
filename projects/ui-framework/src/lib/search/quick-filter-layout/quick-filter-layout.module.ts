import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickFilterLayoutComponent } from './quick-filter-layout.component';
import { IconsModule } from '../../icons/icons.module';
import { DOMhelpers } from '../../services/html/dom-helpers.service';

@NgModule({
  declarations: [QuickFilterLayoutComponent],
  imports: [CommonModule, IconsModule],
  providers: [DOMhelpers],
  exports: [QuickFilterLayoutComponent],
})
export class QuickFilterLayoutModule {}
