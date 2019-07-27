import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialComponent } from './social.component';
import { InputModule } from '../input/input.module';
import { IconsModule } from '../../icons/icons.module';
import { URLutils } from '../../services/url/url-utils.service';

@NgModule({
  declarations: [SocialComponent],
  imports: [CommonModule, InputModule, IconsModule],
  exports: [SocialComponent],
  providers: [URLutils]
})
export class SocialModule {}
