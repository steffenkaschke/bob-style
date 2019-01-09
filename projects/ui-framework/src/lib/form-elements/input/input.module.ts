import {NgModule} from '@angular/core';
import {InputComponent} from './input.component';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule, MatIconModule, MatInputModule} from '@angular/material';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    InputComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
  ],
  exports: [
    InputComponent,
  ],
  providers: [InputComponent],
})
export class InputModule {
}
