import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { IconsModule } from '../../icons';
import { TypographyModule } from '../../typography/typography.module';
import { UtilsService } from '../../utils/utils.service';

@NgModule({
  declarations: [BreadcrumbsComponent],
  imports: [CommonModule, IconsModule, TypographyModule],
  exports: [BreadcrumbsComponent],
  providers: [UtilsService]
})
export class BreadcrumbsModule {}
