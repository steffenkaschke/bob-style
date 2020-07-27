import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadMoreComponent } from './read-more.component';
import { ButtonsModule } from '../../buttons/buttons.module';

@NgModule({
  imports: [CommonModule, ButtonsModule],
  declarations: [ReadMoreComponent],
  exports: [ReadMoreComponent],
  providers: [],
})
export class ReadMoreModule {}
