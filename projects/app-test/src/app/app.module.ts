import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TypographyModule } from '../../../ui-framework/src/lib/typography/typography.module';
import { InputModule } from '../../../ui-framework/src/lib/form-elements/input';
import { DatepickerModule } from '../../../ui-framework/src/lib/form-elements/datepicker/datepicker.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TypographyModule,
    DatepickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
