import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { WelcomeComponent } from './components/welcome/welcome.component';


@NgModule({
  declarations: [
    WelcomeComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
