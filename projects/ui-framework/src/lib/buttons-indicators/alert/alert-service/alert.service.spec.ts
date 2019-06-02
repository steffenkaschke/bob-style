import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {AlertService} from './alert.service';
import {AlertConfig} from '../alert.interface';
import {AlertType} from '../alert.enum';
import {ComponentFactoryResolver} from '@angular/core';
import Spy = jasmine.Spy;
import createSpyObj = jasmine.createSpyObj;
import {AlertComponent} from '../alert.component';
import {MockComponent} from 'ng-mocks';
import {Overlay, OverlayModule} from '@angular/cdk/overlay';
import SpyObj = jasmine.SpyObj;
import {ALERT_CONFIG_MOCK, OVERLAY_CONFIG_MOCK} from '../alert.mock';

describe('AlertService', () => {
  let alertService: AlertService;
  let componentFactoryResolver: ComponentFactoryResolver;
  let overlay: SpyObj<Overlay>;

  beforeEach(() => {
    componentFactoryResolver = createSpyObj('componentFactoryResolver', ['resolveComponentFactory']);
    (componentFactoryResolver.resolveComponentFactory as Spy).and.returnValue(
      { create: () => ({ instance: { showAlert: jasmine.createSpy() } }) });

    const overlayRefMock = {
      attach: jasmine.createSpy(),
      dispose: jasmine.createSpy(),
    };

    overlay = createSpyObj('overlay', ['create', 'position']);
    overlay.create.and.returnValue(overlayRefMock);
    overlay.position.and.returnValue({ global: () => ({ centerHorizontally: () => ({ top: () => 'strategy' })}) });

    TestBed.configureTestingModule({
      imports: [
        OverlayModule,
      ],
      declarations: [
        MockComponent(AlertComponent),
      ],
      providers: [
        AlertService,
        { provide: ComponentFactoryResolver, useValue: componentFactoryResolver },
        { provide: Overlay, useValue: overlay },
      ],
    });
    alertService = TestBed.get(AlertService);
  });

  describe('Alert Service', () => {
    it('should open the alert with the right configuration', () => {
      const alertConfig: AlertConfig = {
        alertType: AlertType.success,
        text: 'text',
        title: 'title'
      };
      alertService.showAlert(alertConfig);
      expect(alertService.alertComponentRef.instance.alertConfig).toEqual(ALERT_CONFIG_MOCK);
      expect(overlay.create).toHaveBeenCalledWith(OVERLAY_CONFIG_MOCK);
      expect(alertService.overlayRef.attach).toHaveBeenCalled();
    });

    it('should open the alert and close after 7 seconds', fakeAsync(() => {
      const ALERT_DURATION_TICK = 7001;
      const alertConfig: AlertConfig = {
        alertType: AlertType.success,
        text: 'text',
        title: 'title'
      };
      alertService.showAlert(alertConfig);
      tick(ALERT_DURATION_TICK);
      expect(alertService.overlayRef.dispose).toHaveBeenCalled();
    }));
  });
});
