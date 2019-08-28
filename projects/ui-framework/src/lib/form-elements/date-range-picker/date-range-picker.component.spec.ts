import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DateRangePickerComponent } from './date-range-picker.component';

describe('DatePickerModule', () => {
  let fixture: ComponentFixture<DateRangePickerComponent>;
  let component: DateRangePickerComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DateRangePickerComponent],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateRangePickerComponent);
    component = fixture.componentInstance;
    spyOn(component.changed, 'emit');
    fixture.detectChanges();
  });
});
