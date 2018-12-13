import { IconService } from './icon.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';
import { Icons } from './icons.enum';

describe('IconService', () => {
  let iconService: IconService;
  let iconRegistry: jasmine.SpyObj<MatIconRegistry>;
  let sanitizer: jasmine.SpyObj<DomSanitizer>;

  beforeEach(() => {
    const spyMatIconRegistry = jasmine.createSpyObj('MatIconRegistry', ['addSvgIcon']);
    const spyDomSanitizer =
      jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);
    spyDomSanitizer.bypassSecurityTrustResourceUrl.and
      .callFake(val => val);
    TestBed.configureTestingModule({
      providers: [
        IconService,
        { provide: MatIconRegistry, useValue: spyMatIconRegistry },
        { provide: DomSanitizer, useValue: spyDomSanitizer }
      ]
    });

    iconService = TestBed.get(IconService);
    iconRegistry = TestBed.get(MatIconRegistry);
    sanitizer = TestBed.get(DomSanitizer);
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      iconService.initIcon(Icons.toDos_link);
    });
    it('should call iconRegistry and sanitizer correct amount of times', () => {
      expect(iconRegistry.addSvgIcon).toHaveBeenCalledTimes(1);
      expect(sanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledTimes(1);
    });
    it('should call iconRegistry and sanitizer with correct params', () => {
      expect(iconRegistry.addSvgIcon.calls.first().args)
        .toEqual(['todos_link', `https://images.hibob.com/icons/todos_link.svg`]);
      expect(sanitizer.bypassSecurityTrustResourceUrl.calls.first().args)
        .toEqual([`https://images.hibob.com/icons/todos_link.svg`]);
    });
  });
});
