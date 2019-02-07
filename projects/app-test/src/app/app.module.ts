import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TypographyModule } from 'bob-style';
import { ButtonsModule } from 'bob-style';
import { DatepickerModule } from 'bob-style';
import { InputModule } from 'bob-style';
import { SelectModule } from 'bob-style';
import { TextareaModule } from 'bob-style';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TypographyModule,
    ButtonsModule,
    DatepickerModule,
    InputModule,
    SelectModule,
    TextareaModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
