import {
  Component,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Dictionary } from 'lodash';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { InfoStripIcon } from '../../buttons-indicators/info-strip/info-strip.types';
import { LightboxConfig } from './lightbox.interface';
import { ButtonType } from '../../buttons-indicators/buttons/buttons.enum';

@Component({
  selector: 'b-lightbox',
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.scss']
})
export class LightboxComponent {
  @ViewChild('lightboxTemplateRef') lightboxTemplateRef: TemplateRef<any>;
  public lightboxConfig: LightboxConfig;
  public closeLightboxCallback: Function;
  readonly iconSize: IconSize = IconSize.xLarge;
  readonly iconsDic: Dictionary<InfoStripIcon> = {
    warning: { color: IconColor.primary, icon: Icons.warning },
    error: { color: IconColor.negative, icon: Icons.error },
    success: { color: IconColor.positive, icon: Icons.success },
    information: { color: IconColor.inform, icon: Icons.baseline_info_icon }
  };
  readonly closeButtonType: ButtonType = ButtonType.tertiary;
  readonly closeButtonIcon: Icons = Icons.close;

  constructor(public viewContainerRef: ViewContainerRef) {}

  public closeLightbox(): void {
    this.closeLightboxCallback();
  }
}
