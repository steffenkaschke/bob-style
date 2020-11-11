import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicListModule, ButtonsModule, IconsModule, MenuModule, MultiListModule } from 'bob-style';
import { EmptyStateModule } from 'bob-style';
import { TranslateModule } from '@ngx-translate/core';
import { MultiListAndListComponent } from './multi-list-and-list.component';
// import { BasicListModule, ButtonsModule } from 'bob-style';

@NgModule({
  declarations: [MultiListAndListComponent],
  imports: [
    CommonModule,
    MultiListModule,
    EmptyStateModule,
    TranslateModule,
    BasicListModule,
    ButtonsModule,
    MenuModule,
    IconsModule,
    // BasicListModule,
    // ButtonsModule,
  ],
  exports: [MultiListAndListComponent],
  providers: [],
})
export class MultiListAndListModule {}
