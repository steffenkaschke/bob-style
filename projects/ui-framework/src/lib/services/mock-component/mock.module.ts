import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockComponent } from './mock.component';
import { UtilsModule } from '../utils/utils.module';
import { DOMhelpers } from '../utils/dom-helpers.service';

@NgModule({
  imports: [CommonModule, UtilsModule],
  declarations: [MockComponent],
  exports: [MockComponent],
  providers: [DOMhelpers]
})
export class MockModule {}
