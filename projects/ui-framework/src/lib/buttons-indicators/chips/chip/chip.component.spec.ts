import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipComponent } from './chip.component';
import { ChipType } from '../chips.enum';
import { By } from '@angular/platform-browser';
import { MatChipsModule } from '@angular/material';
import { ColorService } from '../../../services/color-service/color.service';

describe('ChipComponent', () => {
  let component: ChipComponent;
  let fixture: ComponentFixture<ChipComponent>;
  let chipElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChipComponent],
      imports: [MatChipsModule],
      providers: [ColorService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ChipComponent);
        component = fixture.componentInstance;
        chipElement = fixture.debugElement.query(By.css('.mat-chip'))
          .nativeElement;
      });
  }));

  describe('color & disabled', () => {
    it('should not apply custom color if type is disabled', () => {
      component.ngOnChanges({
        color: new SimpleChange(null, 'red', false),
        type: new SimpleChange(null, ChipType.info, false)
      });
      fixture.detectChanges();
      expect(getComputedStyle(chipElement).backgroundColor).toEqual(
        'rgb(255, 0, 0)'
      );

      component.ngOnChanges({
        type: new SimpleChange(null, ChipType.disabled, false)
      });
      fixture.detectChanges();
      expect(chipElement.classList).toContain('chip-disabled');
      expect(getComputedStyle(chipElement).backgroundColor).not.toEqual(
        'rgb(255, 0, 0)'
      );
    });
  });

  describe('class', () => {
    it('should have type class', () => {
      component.ngOnChanges({
        type: new SimpleChange(null, ChipType.info, false)
      });
      fixture.detectChanges();
      expect(chipElement.classList).toContain('chip-info');
    });
  });

  describe('color', () => {
    it('should apply custom color with color input', () => {
      component.ngOnChanges({
        type: new SimpleChange(null, ChipType.info, false)
      });
      fixture.detectChanges();
      expect(chipElement.classList).toContain('chip-info');

      component.ngOnChanges({
        color: new SimpleChange(null, 'red', false)
      });
      fixture.detectChanges();
      expect(chipElement.classList).not.toContain('chip-info');
      expect(getComputedStyle(chipElement).backgroundColor).toEqual(
        'rgb(255, 0, 0)'
      );
    });
  });
});
