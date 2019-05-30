import {ComponentFactoryResolver, ComponentRef, Injectable, Injector} from '@angular/core';
import {AlertConfig} from '../alert.interface';
import {AlertComponent} from '../alert.component';

@Injectable()
export class AlertService {
  alertComponentRef: ComponentRef<AlertComponent>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private injector: Injector) { }

  public showAlert(config: AlertConfig): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    this.alertComponentRef = componentFactory.create(this.injector);
    this.alertComponentRef.instance.showAlert(config);
  }
}
