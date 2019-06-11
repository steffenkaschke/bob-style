import { DatepickerComponent } from './datepicker.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DatePickerModule', () => {
  let fixture: ComponentFixture<DatepickerComponent>;
  let component: DatepickerComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatepickerComponent],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatepickerComponent);
    component = fixture.componentInstance;
    spyOn(component.changed, 'emit');
    fixture.detectChanges();
  });
  describe('dateClass', () => {
    it('today', () => {
      expect(component.dateClass(new Date())).toEqual('today');
    });
    it('past', () => {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      expect(component.dateClass(date)).toEqual('past');
    });
    it('future', () => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      expect(component.dateClass(date)).toEqual('future');
    });
  });
});
