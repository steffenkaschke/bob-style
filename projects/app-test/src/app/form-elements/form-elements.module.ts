import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormElementsModule } from '../../../../ui-framework/src/lib/form-elements/form-elements.module';
import { IconsModule } from '../../../../ui-framework/src/lib/icons/icons.module';
import { FormElementsTestComponent } from './form-elements.component';
import { AvatarModule } from '../../../../ui-framework/src/lib/buttons-indicators/avatar/avatar.module';

@NgModule({
  declarations: [FormElementsTestComponent],
  exports: [FormElementsTestComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    IconsModule,
    FormElementsModule,
    AvatarModule
  ],
  providers: []
})
export class FormElementsTestModule {}
