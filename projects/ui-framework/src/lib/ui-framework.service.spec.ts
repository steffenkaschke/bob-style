import { TestBed } from '@angular/core/testing';

import { UiFrameworkService } from './ui-framework.service';

describe('UiFrameworkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UiFrameworkService = TestBed.get(UiFrameworkService);
    expect(service).toBeTruthy();
  });
});
