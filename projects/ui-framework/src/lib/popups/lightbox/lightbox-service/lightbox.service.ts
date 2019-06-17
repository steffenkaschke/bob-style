import { ComponentRef, Injectable, SimpleChange } from '@angular/core';
import { LightboxConfig } from '../lightbox.interface';
import { LightboxComponent } from '../lightbox.component';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { bind } from 'lodash';

@Injectable()
export class LightboxService {
  constructor(private overlay: Overlay) {}

  private lightboxPortal: ComponentPortal<LightboxComponent>;
  public lightboxComponentRef: ComponentRef<LightboxComponent>;
  public overlayRef: OverlayRef;
  public isOpen = false;

  private overlayConfig: OverlayConfig = {
    disposeOnNavigation: true,
    hasBackdrop: false,
    panelClass: 'b-lightbox-panel',
    positionStrategy: this.overlay.position().global()
  };

  public showLightbox(config: LightboxConfig): void {
    if (!this.isOpen) {
      this.overlayRef = this.overlay.create(this.overlayConfig);
      this.overlayRef.overlayElement.addEventListener('click', () => {
        this.closeLightbox();
      });

      this.lightboxPortal = new ComponentPortal(LightboxComponent);
      this.lightboxComponentRef = this.overlayRef.attach(this.lightboxPortal);
      this.lightboxComponentRef.instance.closeLightboxCallback = bind(
        this.closeLightbox,
        this
      );
    }

    this.lightboxComponentRef.instance.ngOnChanges({
      config: new SimpleChange(null, config, this.isOpen)
    });
    this.isOpen = true;
  }

  public closeLightbox(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    if (this.lightboxComponentRef) {
      this.lightboxComponentRef.destroy();
      this.lightboxComponentRef = null;
      this.lightboxPortal = null;
    }
    this.isOpen = false;
  }
}
