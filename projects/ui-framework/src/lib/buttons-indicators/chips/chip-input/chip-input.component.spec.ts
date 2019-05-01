import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipComponent } from './chip-input.component';
import { ChipType } from '../chips.enum';
import { By } from '@angular/platform-browser';
import { ColorService } from '../../../services/color-service/color.service';

xdescribe('ChipComponent', () => {
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
        chipElement = fixture.debugElement.query(By.css('span')).nativeElement;
      });
  }));

  describe('color & disabled', () => {
    it('should not apply custom color if type is disabled', () => {});
  });
});
