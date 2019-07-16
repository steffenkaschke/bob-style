import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import {AlertService} from './alert.service';
import { AlertConfig } from '../alert.interface';
import { AlertType } from '../alert.enum';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { MockComponent } from 'ng-mocks';
import { Overlay, OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { ALERT_CONFIG_MOCK } from '../alert.mock';
import { ButtonsModule } from '../../../buttons-indicators/buttons/buttons.module';
import { IconsModule } from '../../../icons/icons.module';
import { TypographyModule } from '../../../typography/typography.module';
import { IconComponent } from '../../../icons/icon.component';
import {AlertComponent} from '../alert.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AlertModule} from '../alert.module';

const ALERT_DURATION_TICK = 7001;
const ALERT_CONFIG: AlertConfig = {
  alertType: AlertType.success,
  text: 'text',
  title: 'title'
};

describe('AlertService', () => {
  let alertService: AlertService;
  let overlayElement: HTMLElement;
  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        OverlayModule,
        ButtonsModule,
        TypographyModule,
        IconsModule,
        BrowserAnimationsModule,
        AlertModule,
      ],
      declarations: [
        MockComponent(IconComponent),
        MockComponent(AlertComponent),
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        AlertService,
      ]
    });
    inject(
      [OverlayContainer, Overlay],
      (oc: OverlayContainer) => {
        overlayElement = oc.getContainerElement();
      }
    )();
    alertService = TestBed.get(AlertService);
  });

  describe('Alert Service', () => {
    it('should create the alert component and init its configuration', fakeAsync(() => {
      alertService.showAlert(ALERT_CONFIG);
      tick(ALERT_DURATION_TICK);
      expect(alertService.alertComponentRef.instance.alertConfig).toEqual(
        ALERT_CONFIG_MOCK
      );
    }));

    it('should start leave animation on button click and close alert', fakeAsync(() => {
      alertService.showAlert(ALERT_CONFIG);
      const closeButton = overlayElement.querySelector(
        'b-square-button button'
      ) as HTMLElement;
      closeButton.click();
      expect(alertService.alertComponentRef.instance.animationState).toEqual('leave');
      alertService.alertComponentRef.instance.onAnimationDone({ toState: 'leave' });
      expect(alertService.overlayRef.hostElement).toBeNull();
      expect(alertService.overlayRef.hasAttached()).toBeFalsy();
      expect(alertService.isOpen).toBeFalsy();
    }));

    it('should close the alert after 7 seconds', fakeAsync(() => {
      alertService.showAlert(ALERT_CONFIG);
      tick(ALERT_DURATION_TICK);
      expect(alertService.alertComponentRef.instance.animationState).toEqual('leave');
      alertService.alertComponentRef.instance.onAnimationDone({ toState: 'leave' });
      expect(alertService.overlayRef.hostElement).toBeNull();
      expect(alertService.overlayRef.hasAttached()).toBeFalsy();
      expect(alertService.isOpen).toBeFalsy();
    }));
  });
});
