import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasonryLayoutComponent } from './masonry.component';

@NgModule({
  imports: [CommonModule],
  declarations: [MasonryLayoutComponent],
  exports: [MasonryLayoutComponent],
})
export class MasonryLayoutModule {}
