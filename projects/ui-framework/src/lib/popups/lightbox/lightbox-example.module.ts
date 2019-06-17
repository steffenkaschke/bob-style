import { Component, NgModule, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightboxService } from './lightbox-service/lightbox.service';
import { LightboxConfig } from './lightbox.interface';
import { LightboxType } from './lightbox.enum';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

@Component({
  selector: 'b-lightbox-example',
  template: `
    <b-button (click)="showLightbox()">Show lightbox</b-button>
  `,
  providers: []
})
export class LightboxExampleComponent implements OnDestroy {

  @Input() public lightboxType: LightboxType;
  @Input() public text: string;
  @Input() public title: string;

  constructor(private lightboxService: LightboxService) {}

  showLightbox(): void {
    const lightboxConfig: LightboxConfig = {
      lightboxType: this.lightboxType,
      title: this.title,
      text: this.text
    };
    this.lightboxService.showLightbox(lightboxConfig);
  }

  ngOnDestroy(): void {
    this.lightboxService.closeLightbox();
  }
}

@NgModule({
  declarations: [LightboxExampleComponent],
  imports: [
    CommonModule,
    ButtonsModule,
    NoopAnimationsModule,
    BrowserAnimationsModule
  ],
  exports: [LightboxExampleComponent],
  providers: [LightboxService]
})
export class LightboxExampleModule {}
