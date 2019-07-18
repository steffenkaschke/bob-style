import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypographyModule } from '../../typography/typography.module';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { SingleListMenuComponent } from './single-list-menu.component';

@NgModule({
  declarations: [
    SingleListMenuComponent,
  ],
  imports: [
    CommonModule,
    TypographyModule,
    ButtonsModule,
  ],
  exports: [
    SingleListMenuComponent,
  ],
})
export class SingleListMenuModule {
}
