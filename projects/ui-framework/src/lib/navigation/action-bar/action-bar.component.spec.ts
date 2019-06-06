import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ActionBarComponent } from './action-bar.component';
import { By } from '@angular/platform-browser';

describe('ActionBarComponent', () => {
  let component: ActionBarComponent;
  let fixture: ComponentFixture<ActionBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActionBarComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ActionBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  describe('template', () => {
    let labelElement: DebugElement;
    it('should populate b-heading with the supplied label', () => {
      component.label = 'test';
      fixture.detectChanges();
      labelElement = fixture.debugElement.query(By.css('b-bold-body'));
      expect(labelElement.nativeElement.textContent).toEqual('test');
    });
  });
});
