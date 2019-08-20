import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionBarComponent } from './action-bar.component';
import { TypographyModule } from '../../typography/typography.module';
import { ButtonsModule } from '../../buttons/buttons.module';

@NgModule({
  entryComponents: [ActionBarComponent],
  declarations: [ActionBarComponent],
  imports: [
    CommonModule,
    TypographyModule,
    ButtonsModule,
  ],
  exports: [ActionBarComponent],
})
export class ActionBarModule {
}
