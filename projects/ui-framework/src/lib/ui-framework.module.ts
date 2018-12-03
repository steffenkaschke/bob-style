import { NgModule } from '@angular/core';
import { AvatarComponent } from './avatar/avatar.component';
import { ButtonComponent } from './button/button.component';

@NgModule({
  declarations: [
    AvatarComponent,
    ButtonComponent
  ],
  imports: [
  ],
  exports: [
    AvatarComponent,
    ButtonComponent
  ]
})
export class UiFrameworkModule { }
