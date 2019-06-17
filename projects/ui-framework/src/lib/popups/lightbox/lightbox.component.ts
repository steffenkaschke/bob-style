import {
  Component,
  Input,
  HostListener,
  SimpleChanges,
  OnChanges,
  HostBinding
} from '@angular/core';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { ButtonType } from '../../buttons-indicators/buttons/buttons.enum';
import { LightboxConfig } from './lightbox.interface';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'b-lightbox',
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.scss']
})
export class LightboxComponent implements OnChanges {
  constructor(public sanitizer: DomSanitizer) {}

  @Input() config: LightboxConfig;

  public closeLightboxCallback: Function;
  public readonly icons = Icons;
  public readonly iconSize = IconSize;
  public readonly iconColor = IconColor;
  public readonly buttons = ButtonType;

  @HostBinding('class')
  get getClass(): string {
    return (
      (this.config.component && !this.config.image && !this.config.url
        ? 'type-component'
        : this.config.url && !this.config.image
        ? 'type-url'
        : 'type-image') + (this.config.fillScreen ? ' fill-cover' : ' fill-contain')
    );
  }

  @HostListener('document:keydown.escape') handleEscape() {
    this.closeLightboxCallback();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.config) {
      this.config = changes.config.currentValue;
    }
  }

  public closeLightbox(): void {
    this.closeLightboxCallback();
  }
}
