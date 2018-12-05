import { NgModule } from '@angular/core';
import './style/style.scss';
import { AvatarComponent } from './avatar/avatar.component';
import { ButtonModule } from './button/button.module';

@NgModule({
  declarations: [
    AvatarComponent,
  ],
  imports: [
    ButtonModule
  ],
  exports: [
    AvatarComponent,
  ]
})
export class UiFrameworkModule { }
