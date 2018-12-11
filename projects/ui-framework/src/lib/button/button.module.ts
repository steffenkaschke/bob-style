import { NgModule } from '@angular/core';
import { ButtonComponent } from './button.component';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule, MatRippleModule } from '@angular/material';

@NgModule({
  declarations: [
    ButtonComponent
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatRippleModule
  ],
  exports: [
    ButtonComponent
  ]
})
export class ButtonModule { }
