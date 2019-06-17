import {
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  Injector
} from '@angular/core';
import { LightboxConfig } from '../lightbox.interface';
import { LightboxComponent } from '../lightbox.component';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { cloneDeep, bind } from 'lodash';
const ALERT_DURATION = 7000;

@Injectable()
export class LightboxService {
  lightboxComponentRef: ComponentRef<LightboxComponent>;
  private overlayConfig: OverlayConfig;
  private templatePortal: TemplatePortal;
  public overlayRef: OverlayRef;
  public isOpen: boolean;
  private timeRef: NodeJS.Timer;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private overlay: Overlay
  ) {}

  public showLightbox(config: LightboxConfig): void {
    if (!this.isOpen) {
      this.injectLightboxComponent();
      this.lightboxComponentRef.instance.lightboxConfig = cloneDeep(config);
      this.lightboxComponentRef.instance.closeLightboxCallback = bind(
        this.closeLightbox,
        this
      );
      this.overlayConfig = this.getConfig();
      this.overlayRef = this.overlay.create(this.overlayConfig);
      this.templatePortal = new TemplatePortal(
        this.lightboxComponentRef.instance.lightboxTemplateRef,
        this.lightboxComponentRef.instance.viewContainerRef
      );
      this.overlayRef.attach(this.templatePortal);
      this.isOpen = true;
      this.timeRef = setTimeout(() => this.closeLightbox(), ALERT_DURATION);
    }
  }

  private injectLightboxComponent(): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      LightboxComponent
    );
    this.lightboxComponentRef = componentFactory.create(this.injector);
  }

  private getConfig(): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .top('20px');
    const panelClass = 'b-lightbox-panel';
    return {
      disposeOnNavigation: true,
      hasBackdrop: false,
      panelClass,
      positionStrategy
    };
  }

  public closeLightbox(): void {
    this.overlayRef.dispose();
    this.isOpen = false;
    clearTimeout(this.timeRef);
  }
}
