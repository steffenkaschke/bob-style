import { TestBed } from '@angular/core/testing';
import { ColorService } from './color.service';

describe('ColorService', () => {
  let colorService: ColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ColorService]
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
