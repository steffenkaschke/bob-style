import { TestBed } from '@angular/core/testing';

import { BobUiFrameworkService } from './bob-ui-framework.service';

describe('BobUiFrameworkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BobUiFrameworkService = TestBed.get(BobUiFrameworkService);
    expect(service).toBeTruthy();
  });
});
