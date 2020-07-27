import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadMoreDirective } from './read-more.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [ReadMoreDirective],
  exports: [ReadMoreDirective],
  providers: [],
})
export class ReadMoreModule {}
