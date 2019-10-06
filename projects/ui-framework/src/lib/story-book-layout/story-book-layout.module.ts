import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryBookLayoutComponent } from './story-book-layout.component';
import { TypographyModule } from '../typography/typography.module';
import 'zone.js/dist/zone-patch-rxjs';
import { StatsModule } from '../services/util-components/stats.module';

@NgModule({
  declarations: [StoryBookLayoutComponent],
  imports: [CommonModule, TypographyModule, StatsModule],
  exports: [StoryBookLayoutComponent],
  providers: []
})
export class StoryBookLayoutModule {}
