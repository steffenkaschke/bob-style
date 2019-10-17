import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RteComponent } from './rte.component';

import 'froala-editor/js/plugins/font_size.min.js';
import 'froala-editor/js/plugins/link.min.js';
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/lists.min.js';
import 'froala-editor/js/plugins/char_counter.min.js';
import 'froala-editor/js/plugins/url.min.js';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { InputMessageModule } from '../input-message/input-message.module';
import { FormElementLabelModule } from '../form-element-label/form-element-label.module';

@NgModule({
  declarations: [RteComponent],
  imports: [
    CommonModule,
    FormElementLabelModule,
    InputMessageModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
  ],
  exports: [RteComponent],
  providers: []
})
export class RteModule {}
