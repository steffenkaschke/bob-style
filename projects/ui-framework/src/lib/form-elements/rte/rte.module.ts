import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RteComponent } from './rte.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

@NgModule({
  declarations: [RteComponent],
  imports: [
    CommonModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
  ],
  exports: [RteComponent],
  providers: []
})
export class RteModule {}
