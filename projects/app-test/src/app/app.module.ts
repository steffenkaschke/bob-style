import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TypographyModule, MultiSelectModule } from 'bob-style';
import { RichTextEditorModule } from '../../../ui-framework/src/lib/form-elements/rich-text-editor/rich-text-editor.module';
import { MatFormFieldModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CheckboxModule } from '../../../ui-framework/src/lib/form-elements/checkbox/checkbox.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    RichTextEditorModule,
    BrowserModule,
    BrowserAnimationsModule,
    TypographyModule,
    MultiSelectModule,
    MatFormFieldModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
