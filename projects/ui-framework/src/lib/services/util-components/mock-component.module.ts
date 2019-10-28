import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockComponent } from './mock.component';
import { DOMhelpers } from '../html/dom-helpers.service';

@NgModule({
  imports: [CommonModule],
  declarations: [MockComponent],
  exports: [MockComponent],
  providers: [DOMhelpers]
})
export class MockComponentModule {}
