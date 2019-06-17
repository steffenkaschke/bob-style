import { Component, NgModule, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightboxService } from './lightbox-service/lightbox.service';
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
    <b-button (click)="showLightbox(showImgCongig)">Show image</b-button>
    &nbsp;
    <b-button (click)="showLightbox(showCompConfig)">Show component</b-button>
    &nbsp;
    <b-button (click)="showLightbox(showUrlConfig)">Show link</b-button>
  `,
  providers: []
})
export class LightboxExampleComponent implements OnDestroy {
  constructor(private lightboxService: LightboxService) {}

  showImgCongig = {
    image:
      'http://deelay.me/3000/https://prod-cdn.wetransfer.net/assets/curated/wallpaper/one_thumbnail_large-99b8c8faf500513d369d009ee036c7ac0b1e1c9eff85cc784e2e10f3a24970ae.jpg'
  };

  showCompConfig = {
    component: {
      component: AvatarComponent,
      attributes: {
        imageSource: 'http://i.pravatar.cc/200',
        size: AvatarSize.large
      }
    }
  };

  showUrlConfig = {
    url: 'https://www.youtube.com/embed/p3j2NYZ8FKs'
  };

  showLightbox(config: LightboxConfig): void {
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
