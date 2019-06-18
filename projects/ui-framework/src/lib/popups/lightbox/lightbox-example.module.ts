import { Component, NgModule, OnDestroy } from '@angular/core';
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
    <b-button id="b1" (click)="showLightbox(configs[0])">Show image</b-button>
    &nbsp;
    <b-button id="b2" (click)="showLightbox(configs[2])"
      >Show component</b-button
    >
    &nbsp;
    <b-button id="b3" (click)="showLightbox(configs[4])">Show link</b-button>
    <br /><br />
    <b-button id="b4" (click)="showLightboxAll()">Show all</b-button>
  `,
  providers: []
})
export class LightboxExampleComponent implements OnDestroy {
  constructor(private lightboxService: LightboxService) {}

  imgDelay = 'http://deelay.me/1000/';

  configs = [
    {
      image: `${
        this.imgDelay
      }https://prod-cdn.wetransfer.net/assets/curated/wallpaper/one_thumbnail_large-99b8c8faf500513d369d009ee036c7ac0b1e1c9eff85cc784e2e10f3a24970ae.jpg`
    },
    {
      image: `${
        this.imgDelay
      }https://cdn1.i-scmp.com/sites/default/files/styles/1200x800/public/images/methode/2019/01/19/a5635224-1ad5-11e9-8ff8-c80f5203e5c9_image_hires_061505.jpg`,
      fillScreen: true
    },
    {
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
    },
    {
      component: {
        component: AvatarComponent,
        attributes: {
          title: 'Jon Bon Jovi',
          subtitle: 'American singer-songwriter',
          orientation: 'vertical',
          imageSource: 'https://api.adorable.io/avatars/350/name2@adorable.png',
          size: AvatarSize.large
        }
      },
      fillScreen: true
    },
    {
      video: `https://www.youtube.com/embed/p3j2NYZ8FKs`
    },
    {
      video: `https://en.wikipedia.org/wiki/Vladimir_Putin`
    }
  ];

  showLightbox(config: LightboxConfig): void {
    this.lightboxService.showLightbox(config);
  }

  showLightboxAll(): void {
    let counter = 0;
    for (let index = 0; index <= 5; index++) {
      setTimeout(() => {
        this.showLightbox(this.configs[index]);
      }, 3000 * counter++);
    }
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
