import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from './utils.service';
import { WindowRef } from './window-ref.service';
import { DOMhelpers } from './dom-helpers.service';
import { FunctionalUtils } from './functional.service';

@NgModule({
  imports: [CommonModule],
  providers: [UtilsService, WindowRef, DOMhelpers, FunctionalUtils]
})
export class UtilsModule {}
