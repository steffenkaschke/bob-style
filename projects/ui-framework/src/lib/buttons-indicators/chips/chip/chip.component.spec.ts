import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipComponent } from './chip.component';
import { ChipType } from '../chips.enum';
import { By } from '@angular/platform-browser';
import { MatChipsModule } from '@angular/material';
import { ColorService } from '../../../services/color-service/color.service';

describe('ButtonComponent', () => {
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

  describe('component', () => {
    it('should have type class', () => {
      component.type = ChipType.info;
      fixture.detectChanges();
      expect(chipElement.classList).toContain('chip-info');
    });

    it('should apply custom color with color input', () => {
      component.type = ChipType.info;
      component.color = 'red';
      fixture.detectChanges();
      expect(chipElement.classList).not.toContain('chip-info');
      expect(getComputedStyle(chipElement).backgroundColor).toEqual(
        'rgb(255, 0, 0)'
      );
    });

    it('should not apply custom color if type is disabled', () => {
      component.type = ChipType.disabled;
      component.color = 'red';
      fixture.detectChanges();
      expect(chipElement.classList).toContain('chip-disabled');
      expect(getComputedStyle(chipElement).backgroundColor).not.toEqual(
        'rgb(255, 0, 0)'
      );
    });
  });
});
