import { Component, NgModule, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightboxService } from './lightbox.service';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule
} from '@angular/platform-browser/animations';
import { AvatarSize } from '../../buttons-indicators/avatar/avatar.enum';
import { AvatarComponent } from '../../buttons-indicators/avatar/avatar.component';
import { AvatarModule } from '../../buttons-indicators/avatar/avatar.module';
import { LightboxConfig } from './lightbox.interface';

@Component({
  selector: 'b-lightbox-example',
  template: `
    <b-button (click)="showLightbox()">Show lightbox</b-button>
  `,
  providers: []
})
export class LightboxExampleComponent implements OnDestroy {
  constructor(private lightboxService: LightboxService) {}

  @Input() imageLink: string;
  @Input() videoLink: string;
  @Input() showInLightbox: string;

  showLightbox(): void {
    const config: LightboxConfig =
      this.showInLightbox === 'image' && this.imageLink
        ? {
            image: this.imageLink
          }
        : this.showInLightbox === 'video' && this.videoLink
        ? {
            video: this.videoLink
          }
        : this.showInLightbox === 'component'
        ? {
            component: {
              component: AvatarComponent,
              attributes: {
                title: 'John Malkovich',
                subtitle: 'American actor',
                orientation: 'vertical',
                imageSource: `https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/John_Malkovich_KVIFF_2.jpg/220px-John_Malkovich_KVIFF_2.jpg`,
                size: AvatarSize.large
              }
            }
          }
        : null;

    this.lightboxService.showLightbox(config);
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
    BrowserAnimationsModule,
    AvatarModule
  ],
  exports: [LightboxExampleComponent],
  providers: [LightboxService],
  entryComponents: [AvatarComponent]
})
export class LightboxExampleModule {}
