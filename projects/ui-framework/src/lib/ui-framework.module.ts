import { NgModule } from '@angular/core';
import { UiFrameworkComponent } from './ui-framework.component';
import { AvatarComponent } from './avatar/avatar.component';

@NgModule({
  declarations: [UiFrameworkComponent, AvatarComponent],
  imports: [
  ],
  exports: [UiFrameworkComponent]
})
export class UiFrameworkModule { }
