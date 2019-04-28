import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA, Component, SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PanelModule } from '../../overlay/panel/panel.module';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';

import { DOMhelpers } from '../utils/dom-helpers.service';

@Component({
  template: `
    <div class="form">
      <b-rich-text-editor [formControl]="rteControl"> </b-rich-text-editor>
    </div>
  `,
  providers: []
})
class TestComponent {
  constructor() {}
}

xdescribe('RichTextEditorComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let testComponent: TestComponent;

  let RTEnativeElement: HTMLElement;
  let RTEeditorNativeElement: HTMLElement;
  let platform: Platform;
  let overlayContainer: OverlayContainer;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [CommonModule, BrowserAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [DOMhelpers]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestComponent);
        testComponent = fixture.componentInstance;

        fixture.detectChanges();

        RTEnativeElement = fixture.debugElement.query(
          By.css('b-rich-text-editor')
        ).nativeElement;

        RTEeditorNativeElement = fixture.debugElement.query(
          By.css('.quill-editor')
        ).nativeElement;
      });
  }));

  describe('OnInit', () => {});
});
