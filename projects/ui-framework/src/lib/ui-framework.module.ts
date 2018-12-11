import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import './style/style.scss';
import { AvatarComponent } from './avatar/avatar.component';
import { ButtonModule } from './button/button.module';
import { TypographyModule } from './typography/typography.module';

@NgModule({
  declarations: [
    AvatarComponent,
  ],
  imports: [
    BrowserModule,
    ButtonModule,
    TypographyModule
  ],
  exports: [
    AvatarComponent,
  ]
})
export class UiFrameworkModule { }
