import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { LightboxService } from './lightbox.service';
import { LightboxConfig } from '../lightbox.interface';
import {
  ComponentFactoryResolver,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { LightboxComponent } from '../lightbox.component';
import { MockComponent } from 'ng-mocks';
import { Overlay, OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { ButtonsModule } from '../../../buttons-indicators/buttons/buttons.module';
import { IconsModule } from '../../../icons/icons.module';
import { TypographyModule } from '../../../typography/typography.module';
import { LightboxModule } from '../lightbox.module';
import { IconSize } from '../../../icons/icons.enum';
import { IconComponent } from '../../../icons/icon.component';
import { IconService } from '../../../icons/icon.service';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

const ALERT_DURATION_TICK = 7001;

// describe('LightboxService', () => {
//   let lightboxService: LightboxService;
//   let overlayElement: HTMLElement;
//   let spyIconService: SpyObj<IconService>;

//   beforeEach(() => {
//     spyIconService = createSpyObj('spyIconService', ['initIcon']);

//     TestBed.configureTestingModule({
//       imports: [
//         LightboxModule,
//         OverlayModule,
//         ButtonsModule,
//         TypographyModule,
//         IconsModule
//       ],
//       declarations: [
//         MockComponent(IconComponent),
//         MockComponent(LightboxComponent)
//       ],
//       providers: [
//         LightboxService,
//         { provide: IconService, useValue: spyIconService }
//       ],
//       schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
//     });
//     inject(
//       [OverlayContainer, ComponentFactoryResolver, Overlay],
//       (oc: OverlayContainer) => {
//         overlayElement = oc.getContainerElement();
//       }
//     )();
//     lightboxService = TestBed.get(LightboxService);
//   });

//   describe('Lightbox Service', () => {
//     it('should inject the lightbox component with the right configuration', fakeAsync(() => {
//       const lightboxConfig: LightboxConfig = {
//         lightboxType: LightboxType.success,
//         text: 'text',
//         title: 'title'
//       };
//       lightboxService.showLightbox(lightboxConfig);
//       tick(ALERT_DURATION_TICK);
//       expect(lightboxService.lightboxComponentRef.instance.lightboxConfig).toEqual(
//         ALERT_CONFIG_MOCK
//       );
//     }));

//     it('should check lightbox native elements', fakeAsync(() => {
//       const lightboxConfig: LightboxConfig = {
//         lightboxType: LightboxType.success,
//         text: 'text',
//         title: 'title'
//       };
//       lightboxService.showLightbox(lightboxConfig);
//       const titleElement = overlayElement.querySelector(
//         'b-bold-body'
//       ) as HTMLElement;
//       const textElement = overlayElement.querySelector(
//         '.content p'
//       ) as HTMLElement;
//       const iconElement = overlayElement.querySelector(
//         '.icon mat-icon'
//       ) as HTMLElement;
//       expect(titleElement.innerText).toEqual('TITLE');
//       expect(textElement.innerText).toEqual('text');
//       expect(iconElement.classList.contains(IconSize.xLarge)).toBeTruthy();
//       expect(lightboxService.isOpen).toBeTruthy();
//       tick(ALERT_DURATION_TICK);
//     }));

//     it('should close lightbox on button click', fakeAsync(() => {
//       const lightboxConfig: LightboxConfig = {
//         lightboxType: LightboxType.success,
//         text: 'text',
//         title: 'title'
//       };
//       lightboxService.showLightbox(lightboxConfig);
//       const closeButton = overlayElement.querySelector(
//         'b-square-button button'
//       ) as HTMLElement;
//       closeButton.click();
//       tick(ALERT_DURATION_TICK);
//       expect(lightboxService.overlayRef.hostElement).toBeNull();
//       expect(lightboxService.overlayRef.hasAttached()).toBeFalsy();
//       expect(lightboxService.isOpen).toBeFalsy();
//     }));

//     it('should close the lightbox after 7 seconds', fakeAsync(() => {
//       const lightboxConfig: LightboxConfig = {
//         lightboxType: LightboxType.success,
//         text: 'text',
//         title: 'title'
//       };
//       lightboxService.showLightbox(lightboxConfig);
//       tick(ALERT_DURATION_TICK);
//       expect(lightboxService.overlayRef.hostElement).toBeNull();
//       expect(lightboxService.overlayRef.hasAttached()).toBeFalsy();
//       expect(lightboxService.isOpen).toBeFalsy();
//     }));
//   });
// });
