import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DOMhelpers } from './dom-helpers.service';
<<<<<<< HEAD
import { HtmlParserHelpers } from './html-parser.service';

@NgModule({
  imports: [CommonModule],
  providers: [DOMhelpers, HtmlParserHelpers]
=======

@NgModule({
  imports: [CommonModule],
  providers: [DOMhelpers]
>>>>>>> origin/master
})
export class HtmlHelpersModule {}
