import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionContainerComponent } from './sectionContainer.component';
import { TypographyModule } from '../../typography/typography.module';

@NgModule({
  declarations: [SectionContainerComponent],
  imports: [CommonModule, TypographyModule],
  exports: [SectionContainerComponent],
  providers: []
})
export class SectionContainerModule {}
