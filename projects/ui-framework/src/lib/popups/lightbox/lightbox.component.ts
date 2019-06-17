import { Component, Input, HostListener } from '@angular/core';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { ButtonType } from '../../buttons-indicators/buttons/buttons.enum';
import { LightboxConfig } from './lightbox.interface';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'b-lightbox',
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.scss']
})
export class LightboxComponent {
  constructor(public sanitizer: DomSanitizer) {}

  @Input() config: LightboxConfig;

  public closeLightboxCallback: Function;
  public readonly icons = Icons;
  public readonly iconSize = IconSize;
  public readonly iconColor = IconColor;
  public readonly buttons = ButtonType;

  @HostListener('document:keydown.escape') handleEscape() {
    this.closeLightboxCallback();
  }

  public closeLightbox(): void {
    this.closeLightboxCallback();
  }
}
