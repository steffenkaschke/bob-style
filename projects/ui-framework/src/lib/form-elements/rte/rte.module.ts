import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RteComponent } from './rte.component';

import { InputMessageModule } from '../input-message/input-message.module';
import { FormElementLabelModule } from '../form-element-label/form-element-label.module';
import { PlaceholdersConverterService } from './placeholders.service';
import { RteService } from './rte.service';
import { HtmlParserHelpers } from '../../services/html/html-parser.service';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import 'froala-editor/js/plugins/font_size.min.js';
import 'froala-editor/js/plugins/link.min.js';
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/lists.min.js';
import 'froala-editor/js/plugins/char_counter.min.js';
import 'froala-editor/js/plugins/url.min.js';

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
  providers: [RteService, PlaceholdersConverterService, HtmlParserHelpers]
})
export class RteModule {}
