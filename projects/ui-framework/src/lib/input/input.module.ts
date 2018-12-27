import { NgModule } from '@angular/core';
import { InputComponent } from './input.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule, MatInputModule } from '@angular/material';

@NgModule({
  declarations: [InputComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  exports: [InputComponent],
  providers: [InputComponent],
})
export class InputModule {
}
