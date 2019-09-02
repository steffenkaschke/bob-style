import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialComponent } from './social.component';
import { InputModule } from '../input/input.module';
import { IconsModule } from '../../icons/icons.module';
import { URLutils } from '../../services/url/url-utils.service';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';

@NgModule({
  declarations: [SocialComponent],
  imports: [CommonModule, InputModule, IconsModule],
  exports: [SocialComponent],
  providers: [URLutils, EventManagerPlugins[0]]
})
export class SocialModule {}
