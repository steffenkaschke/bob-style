import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import './style/style.scss';
import { AvatarComponent } from './avatar/avatar.component';
import { ButtonsModule } from './buttons/buttons.module';
import { TypographyModule } from './typography/typography.module';

@NgModule({
  declarations: [
    AvatarComponent,
  ],
  imports: [
    BrowserModule,
    ButtonsModule,
    TypographyModule
  ],
  exports: [
    AvatarComponent,
  ]
})
export class UiFrameworkModule { }
