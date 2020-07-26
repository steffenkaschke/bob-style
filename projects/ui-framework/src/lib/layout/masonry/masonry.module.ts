import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasonryComponent } from './masonry.component';

@NgModule({
  imports: [CommonModule],
  declarations: [MasonryComponent],
  exports: [MasonryComponent],
})
export class MasonryModule {}
