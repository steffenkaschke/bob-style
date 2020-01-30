import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  InputMessageModule,
  FormElementLabelModule,
  HtmlParserHelpers,
  SingleSelectPanelModule,
  ButtonsModule,
  PanelModule,
  SearchModule,
} from 'bob-style';

import { RichTextEditorComponent } from './rte.component';
import { PlaceholdersConverterService } from './placeholders.service';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import 'froala-editor/js/plugins/font_size.min.js';
import 'froala-editor/js/plugins/link.min.js';
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/lists.min.js';
import 'froala-editor/js/plugins/char_counter.min.js';
import 'froala-editor/js/plugins/url.min.js';
import 'froala-editor/js/plugins/emoticons.min.js';
import 'froala-editor/js/plugins/video.min.js';
import 'froala-editor/js/plugins/image.min.js';
import { GifSearchComponent } from './gif-search/gif-search.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [RichTextEditorComponent, GifSearchComponent],
  imports: [
    CommonModule,
    FormElementLabelModule,
    InputMessageModule,
    SingleSelectPanelModule,
    ButtonsModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    PanelModule,
    SearchModule,
    HttpClientModule,
  ],
  exports: [RichTextEditorComponent],
  providers: [PlaceholdersConverterService, HtmlParserHelpers],
})
export class RichTextEditorModule {}
