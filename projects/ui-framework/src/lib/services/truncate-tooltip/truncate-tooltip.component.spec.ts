import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import {
  NO_ERRORS_SCHEMA,
  Component,
  SimpleChange,
  Input
} from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TruncateTooltipComponent } from './truncate-tooltip.component';

import { PanelModule } from '../../overlay/panel/panel.module';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';

import { DOMhelpers } from '../utils/dom-helpers.service';

@Component({
  template: `
    <div class="test" *bTruncateTooltip="maxLines">
      <p><!-- HTML Comment --></p>
      <div>
        <p class="right-one">
          <span> Hello </span>
          World
        </p>
      </div>
    </div>
  `,
  providers: []
})
class TestComponent {
  constructor() {}
  @Input() maxLines: number;
}

xdescribe('RichTextEditorComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let testComponent: TestComponent;

  let truncateTooltipComponent: TruncateTooltipComponent;

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
      });
  }));

  describe('OnInit', () => {});
});
