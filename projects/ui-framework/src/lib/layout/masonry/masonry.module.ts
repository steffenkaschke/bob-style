import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasonryLayoutComponent } from './masonry.component';
import { MasonryService } from './masonry.service';

@NgModule({
  imports: [CommonModule],
  declarations: [MasonryLayoutComponent],
  exports: [MasonryLayoutComponent],
  providers: [MasonryService],
})
export class MasonryLayoutModule {}
