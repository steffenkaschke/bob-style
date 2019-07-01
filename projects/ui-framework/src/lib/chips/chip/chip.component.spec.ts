import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipComponent } from './chip.component';
import { ChipType } from '../chip.enum';
import { By } from '@angular/platform-browser';
import { ColorService } from '../../services/color-service/color.service';

describe('ChipComponent', () => {
  let component: ChipComponent;
  let fixture: ComponentFixture<ChipComponent>;
  let chipElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChipComponent],
      imports: [],
      providers: [ColorService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ChipComponent);
        component = fixture.componentInstance;
        chipElement = fixture.nativeElement;
      });
  }));

  describe('text', () => {
    it('should put the right text', () => {
      component.text = 'test';
      fixture.detectChanges();
      expect(chipElement.innerText).toEqual('test');
    });
  });

  describe('class', () => {
    it('should have the right type class', () => {
      component.type = ChipType.info;
      fixture.detectChanges();
      expect(chipElement.classList).toContain('chip-info');
      component.type = ChipType.success;
      fixture.detectChanges();
      expect(chipElement.classList).not.toContain('chip-info');
      expect(chipElement.classList).toContain('chip-success');
    });
  });

  describe('removable', () => {
    it('should have remove button, if removable is true', () => {
      let removeButton = fixture.debugElement.query(By.css('.remove-button'));
      expect(removeButton).toBeFalsy();

      component.removable = true;
      fixture.detectChanges();

      removeButton = fixture.debugElement.query(By.css('.remove-button'));
      expect(removeButton).toBeTruthy();
    });
  });

  describe('disabled', () => {
    it('should not put type class, when disabled is true, instead put disabled class', () => {
      component.type = ChipType.info;
      component.disabled = true;
      fixture.detectChanges();
      expect(chipElement.classList).not.toContain('chip-info');
      expect(chipElement.classList).toContain('chip-disabled');
    });
    it('should not put remove button, when disabled is true, even if removable is true as well', () => {
      component.type = ChipType.info;
      component.removable = true;
      component.disabled = true;
      fixture.detectChanges();
      const removeButton = fixture.debugElement.query(By.css('.remove-button'));
      expect(removeButton).toBeFalsy();
    });
  });

  describe('selectable', () => {
    it('should add tabindex="0", if selectable is true', () => {
      component.selectable = true;
      fixture.detectChanges();
      expect(chipElement.getAttribute('tabindex')).toEqual('0');
    });
  });
});
