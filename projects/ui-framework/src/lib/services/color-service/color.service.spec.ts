import { TestBed } from '@angular/core/testing';
import { ColorService } from './color.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ColorService', () => {
  let colorService: ColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ColorService],
      schemas: [NO_ERRORS_SCHEMA]
    });

    colorService = TestBed.get(ColorService);
  });

  describe('isDark', () => {
    it('given RGB color as string, should decide if its dark or not', () => {
      expect(colorService.isDark('rgb(255,0,0)')).toBeTruthy();
      expect(colorService.isDark('rgb(200,200,200)')).toBeFalsy();
    });
  });
});
