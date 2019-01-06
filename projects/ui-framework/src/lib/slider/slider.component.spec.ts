import { SliderComponent } from './slider.component';
import {
  ComponentFixture,
  async,
  TestBed
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSliderChange } from '@angular/material';

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
    spyOn(component.progressChange, 'emit');
    fixture.detectChanges();
  });

  describe('onProgressChange', () => {
    it('Should emit the change event', () => {
      const e: MatSliderChange = {
        source: null,
        value: 10,
      };
      component.onProgressChange(e);
      expect(component.progressChange.emit).toHaveBeenCalledWith(e);
    });
  });
});
