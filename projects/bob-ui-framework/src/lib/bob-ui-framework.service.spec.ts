import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { BobUiFrameworkService } from './bob-ui-framework.service';

xdescribe('BobUiFrameworkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
       platformBrowserDynamicTesting());
       TestBed.configureTestingModule({});
   });

  it('should be created', () => {
    const service: BobUiFrameworkService = TestBed.get(BobUiFrameworkService);
    expect(service).toBeTruthy();
  });
});
