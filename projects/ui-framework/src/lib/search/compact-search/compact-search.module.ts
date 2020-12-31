import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompactSearchComponent } from './compact-search.component';
import { SearchModule } from '../search/search.module';
import { ButtonsModule } from '../../buttons/buttons.module';



@NgModule({
  declarations: [CompactSearchComponent],
  exports: [CompactSearchComponent],
  imports: [
    CommonModule,
    SearchModule,
    ButtonsModule,
  ],
})
export class CompactSearchModule { }
