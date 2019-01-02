import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from './avatar.component';

@NgModule({
  declarations: [AvatarComponent],
  imports: [
    BrowserModule,
    CommonModule
  ],
  exports: [AvatarComponent],
})
export class AvatarModule {
}
