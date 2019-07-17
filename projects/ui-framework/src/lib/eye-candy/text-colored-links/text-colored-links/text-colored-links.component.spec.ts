import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextColoredLinksComponent } from './text-colored-links.component';
import {COLOR_TEXT_ITEMS} from './text-colored-links.mocks';

describe('TextColoredLinksComponent', () => {
  let component: TextColoredLinksComponent;
  let fixture: ComponentFixture<TextColoredLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextColoredLinksComponent ]
    })
    .compileComponents().then(() => {
      fixture = TestBed.createComponent(TextColoredLinksComponent);
      component = fixture.componentInstance;
      component.colorTextItems = COLOR_TEXT_ITEMS;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
