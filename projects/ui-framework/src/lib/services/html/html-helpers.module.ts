import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DOMhelpers } from './dom-helpers.service';

@NgModule({
  imports: [CommonModule],
  providers: [DOMhelpers]
})
export class HtmlHelpersModule {}
