import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TypographyModule, MultiSelectModule } from 'bob-style';
import { ChipsModule } from '../../../ui-framework/src/lib/buttons-indicators/chips/chips.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    ChipsModule,
    BrowserModule,
    BrowserAnimationsModule,
    TypographyModule,
    MultiSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
