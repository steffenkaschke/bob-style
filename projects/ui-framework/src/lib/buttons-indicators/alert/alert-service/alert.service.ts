import {ComponentFactoryResolver, ComponentRef, Injectable, Injector} from '@angular/core';
import {AlertConfig} from '../alert.interface';
import {AlertComponent} from '../alert.component';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';
import {cloneDeep, bind} from 'lodash';
const ALERT_DURATION = 7000;
const ANIMATION_DURATION = 500;

@Injectable()
export class AlertService {
  alertComponentRef: ComponentRef<AlertComponent>;
  private overlayConfig: OverlayConfig;
  private templatePortal: TemplatePortal;
  public overlayRef: OverlayRef;
  private timeRef: NodeJS.Timer;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private injector: Injector,
              private overlay: Overlay) { }

  public showAlert(config: AlertConfig): void {
    this.injectAlertComponent();
    this.alertComponentRef.instance.alertConfig = cloneDeep(config);
    this.alertComponentRef.instance.closeAlertCallback = bind(this.closeAlert, this);
    this.overlayConfig = this.getConfig();
    this.overlayRef = this.overlay.create(this.overlayConfig);
    this.templatePortal = new TemplatePortal(
      this.alertComponentRef.instance.alertTemplateRef,
      this.alertComponentRef.instance.viewContainerRef
    );
    this.overlayRef.attach(this.templatePortal);
    this.timeRef = setTimeout(() => this.closeAlert(), ALERT_DURATION);
  }

  private injectAlertComponent(): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    this.alertComponentRef = componentFactory.create(this.injector);
  }

  private getConfig(): OverlayConfig {
    const positionStrategy = this.overlay.position().global()
      .centerHorizontally();
    const panelClass = 'b-alert-panel';
    return {
      disposeOnNavigation: true,
      hasBackdrop: false,
      panelClass,
      positionStrategy,
    };
  }

  public closeAlert(): void {
    this.overlayRef.addPanelClass('close-panel');
    setTimeout(() => {
      this.overlayRef.dispose();
      clearTimeout(this.timeRef);
    }, ANIMATION_DURATION);
  }
}
