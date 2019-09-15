import { NgModule } from '@angular/core';
import { HighlightPipe } from './highlight.pipe';
import {LinkifyPipe} from './linkify.pipe';

@NgModule({
  imports: [
  ],
  declarations: [
    HighlightPipe,
    LinkifyPipe
  ],
  exports: [
    HighlightPipe,
    LinkifyPipe
  ],
})
export class FiltersModule {
}
