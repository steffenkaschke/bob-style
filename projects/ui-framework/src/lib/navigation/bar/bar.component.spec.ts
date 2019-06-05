import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { BarComponent } from './bar.component';
import { By } from '@angular/platform-browser';

describe('BarComponent', () => {
  let component: BarComponent;
  let fixture: ComponentFixture<BarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BarComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(BarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  describe('template', () => {
    let labelElement: DebugElement;
    it('should populate b-heading with the supplied label', () => {
      component.label = 'test';
      fixture.detectChanges();
      labelElement = fixture.debugElement.query(By.css('b-heading'));
      expect(labelElement.nativeElement.textContent).toEqual('test');
    });
  });
});
