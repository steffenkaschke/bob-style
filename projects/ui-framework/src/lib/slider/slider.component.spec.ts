import { SliderComponent } from './slider.component';
import {
  ComponentFixture,
  async,
  TestBed
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SliderModule', () => {
  let fixture: ComponentFixture<SliderComponent>;
  let component: SliderComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SliderComponent],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
