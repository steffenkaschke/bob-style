import { Component, Input, HostListener } from '@angular/core';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { ButtonType } from '../../buttons-indicators/buttons/buttons.enum';
import { LightboxConfig } from './lightbox.interface';

@Component({
  selector: 'b-lightbox',
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.scss']
})
export class LightboxComponent {
  constructor() {}

  @Input() config: LightboxConfig;

  public closeLightboxCallback: Function;

  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;
  readonly buttons = ButtonType;

  @HostListener('document:keydown.escape') handleEscape() {
    this.closeLightboxCallback();
  }

  public closeLightbox(): void {
    this.closeLightboxCallback();
  }
}
