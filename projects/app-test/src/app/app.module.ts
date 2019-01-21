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
import { TableModule } from 'projects/ui-framework/src/lib/table/table.module';
import { TestComponent } from './test/test.component';


@NgModule({
  declarations: [
    AppComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TypographyModule,
    DatepickerModule,
    TableModule,
    ButtonsModule,
    DatepickerModule,
    InputModule,
    SelectModule,
    TextareaModule,
  ],
  providers: [],
  entryComponents: [TestComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
