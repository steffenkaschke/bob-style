import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { SwitchToggleComponent } from './switch-toggle.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [SwitchToggleComponent],
  imports: [
    BrowserModule,
    CommonModule,
    MatSlideToggleModule
  ],
  exports: [SwitchToggleComponent],
})
export class SwitchToggleModule {
}
