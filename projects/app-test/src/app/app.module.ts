import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TypographyModule } from '../../../ui-framework/src/lib/typography/typography.module';
import { DatepickerModule } from '../../../ui-framework/src/lib/form-elements/datepicker/datepicker.module';
import { FormElementsModule } from '../../../ui-framework/src/lib/form-elements/form-elements.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TypographyModule,
    DatepickerModule,
    FormElementsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [AppComponent]
})
export class AppModule { }
