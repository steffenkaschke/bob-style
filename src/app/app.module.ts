import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { WelcomeComponent } from './components/welcome/welcome.component';
import { AvatarComponent } from './components/avatar/avatar.component';


@NgModule({
  declarations: [
    WelcomeComponent,
    AvatarComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
