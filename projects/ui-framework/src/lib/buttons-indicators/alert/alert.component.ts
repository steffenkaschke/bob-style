import {Component, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {cloneDeep, Dictionary} from 'lodash';
import {IconColor, Icons, IconSize} from '../../icons/icons.enum';
import {InfoStripIcon} from '../info-strip/info-strip.types';
import {AlertConfig} from './alert.interface';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';

const ALERT_DURATION = 3000;

@Component({
  selector: 'b-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {
  @ViewChild('alertTemplateRef') alertTemplateRef: TemplateRef<any>;
  public alertConfig: AlertConfig;
  readonly iconSize: IconSize = IconSize.xLarge;
  readonly iconsDic: Dictionary<InfoStripIcon> = {
    warning: { color: IconColor.primary, icon: Icons.warning },
    error: { color: IconColor.negative, icon: Icons.error },
    success: { color: IconColor.positive, icon: Icons.success },
    information: { color: IconColor.inform, icon: Icons.baseline_info_icon },
  };
  public closeIcon: Icons = Icons.close;
  public closeColor: IconColor = IconColor.dark;
  public closeSize: IconSize = IconSize.medium;
  private overlayConfig: OverlayConfig;
  private templatePortal: TemplatePortal;
  public overlayRef: OverlayRef;

  constructor(private overlay: Overlay,
              private viewContainerRef: ViewContainerRef) { }

  public showAlert(alertConfig: AlertConfig): void {
    this.alertConfig = cloneDeep(alertConfig);
    this.overlayConfig = this.getConfig();
    this.overlayRef = this.overlay.create(this.overlayConfig);
    this.templatePortal = new TemplatePortal(
      this.alertTemplateRef,
      this.viewContainerRef
    );
    this.overlayRef.attach(this.templatePortal);
    setTimeout(() => this.closeAlert(), ALERT_DURATION);
  }

  private getConfig(): OverlayConfig {
    const positionStrategy = this.overlay.position().global()
      .centerHorizontally().top('20px');
    const panelClass = 'b-alert';
    const backdropClass = '';
    return {
      disposeOnNavigation: true,
      hasBackdrop: false,
      backdropClass,
      panelClass,
      positionStrategy,
    };
  }

  public closeAlert(): void {
    this.overlayRef.dispose();
  }
}
