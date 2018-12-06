import { NgModule } from '@angular/core';
import './style/style.scss';
import { AvatarComponent } from './avatar/avatar.component';
import { ButtonModule } from './button/button.module';
import { TypographyModule } from './typography/typography.module';

@NgModule({
  declarations: [
    AvatarComponent,
  ],
  imports: [
    ButtonModule,
    TypographyModule
  ],
  exports: [
    AvatarComponent,
  ]
})
export class UiFrameworkModule { }
