import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SocialModule } from '../../../ui-framework/src/lib/form-elements/social/social.module';
import { FormElementsModule } from '../../../ui-framework/src/lib/form-elements/form-elements.module';
import { ChipsModule } from '../../../ui-framework/src/lib/buttons-indicators/chips/chips.module';
import { RichTextEditorModule } from '../../../ui-framework/src/lib/form-elements/rich-text-editor/rte.module';
import { IconsModule } from '../../../ui-framework/src/lib/icons/icons.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    IconsModule,

    FormElementsModule,
    RichTextEditorModule,
    ChipsModule,
    SocialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
