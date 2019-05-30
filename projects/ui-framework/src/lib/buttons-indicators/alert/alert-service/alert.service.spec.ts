import {TestBed} from '@angular/core/testing';
import {AlertService} from './alert.service';
import {AlertConfig} from '../alert.interface';
import {AlertType} from '../alert.enum';
import {ComponentFactoryResolver} from '@angular/core';
import Spy = jasmine.Spy;
import createSpyObj = jasmine.createSpyObj;
import {AlertComponent} from '../alert.component';
import {MockComponent} from 'ng-mocks';

describe('AlertService', () => {
  let alertService: AlertService;
  let componentFactoryResolver: ComponentFactoryResolver;

  beforeEach(() => {
    componentFactoryResolver = createSpyObj('componentFactoryResolver', ['resolveComponentFactory']);
    (componentFactoryResolver.resolveComponentFactory as Spy).and.returnValue(
      { create: () => ({ instance: { showAlert: jasmine.createSpy() } }) });

    TestBed.configureTestingModule({
      declarations: [
        MockComponent(AlertComponent),
      ],
      providers: [
        AlertService,
        { provide: ComponentFactoryResolver, useValue: componentFactoryResolver }
      ],
    });
    alertService = TestBed.get(AlertService);
  });

  describe('Alert Service', () => {
    it('should call to open alert with config', () => {
      const config: AlertConfig = {
        title: 'title',
        text: 'alert text',
        alertType: AlertType.success,
      };
      alertService.showAlert(config);
      expect(alertService.alertComponentRef.instance.showAlert).toHaveBeenCalled();
    });
  });
});
