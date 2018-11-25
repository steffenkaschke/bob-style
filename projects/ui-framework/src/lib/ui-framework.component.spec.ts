import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiFrameworkComponent } from './ui-framework.component';

describe('UiFrameworkComponent', () => {
  let component: UiFrameworkComponent;
  let fixture: ComponentFixture<UiFrameworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiFrameworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiFrameworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
