import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SocialModule } from '../../../ui-framework/src/lib/form-elements/social/social.module';
import { FormElementsModule } from '../../../ui-framework/src/lib/form-elements/form-elements.module';
import { ChipModule } from '../../../ui-framework/src/lib/buttons-indicators/chip/chip.module';
import { RichTextEditorModule } from '../../../ui-framework/src/lib/form-elements/rich-text-editor/rte.module';
import { IconsModule } from '../../../ui-framework/src/lib/icons/icons.module';
import { FormElementsTestModule } from './form-elements/form-elements.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormElementsTestModule

    // FormsModule,
    // ReactiveFormsModule,
    // IconsModule,

    // FormElementsModule,
    // RichTextEditorModule,
    // ChipModule,
    // SocialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
