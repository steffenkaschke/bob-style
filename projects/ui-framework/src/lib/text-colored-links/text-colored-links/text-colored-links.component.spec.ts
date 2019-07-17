import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextColoredLinksComponent } from './text-colored-links.component';

describe('TextColoredLinksComponent', () => {
  let component: TextColoredLinksComponent;
  let fixture: ComponentFixture<TextColoredLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextColoredLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextColoredLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
