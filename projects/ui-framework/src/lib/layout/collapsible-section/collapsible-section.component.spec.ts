import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { By, EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { CollapsibleSectionComponent } from './collapsible-section.component';

import { TypographyModule } from '../../typography/typography.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';
import { OutsideZonePlugin } from '../../services/utils/eventManager.plugins';

@Component({
  template: `
    <b-collapsible-section [@.disabled]="true">
      <span suffix>suffix</span>
      <span class="test-content" style="height: 300px;">content</span>
    </b-collapsible-section>
  `,
  providers: []
})
class TestComponent {
  constructor() {}
}

describe('CollapsibleComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let collapsibleComponent: CollapsibleSectionComponent;
  let collapsibleNativeElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, CollapsibleSectionComponent],
      imports: [MatExpansionModule, BrowserAnimationsModule, TypographyModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        DOMhelpers,
        {
          multi: true,
          provide: EVENT_MANAGER_PLUGINS,
          useClass: OutsideZonePlugin
        }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        collapsibleComponent = fixture.debugElement.query(
          By.css('b-collapsible')
        ).componentInstance;
        collapsibleNativeElement = fixture.debugElement.query(
          By.css('b-collapsible')
        ).nativeElement;

        spyOn(collapsibleComponent.opened, 'emit');
        spyOn(collapsibleComponent.closed, 'emit');
      });
  }));
});
