import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarComponent } from './bar.component';
import { TypographyModule } from '../../typography/typography.module';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';

@NgModule({
  entryComponents: [BarComponent],
  declarations: [BarComponent],
  imports: [
    CommonModule,
    TypographyModule,
    ButtonsModule,
  ],
  exports: [BarComponent],
})
export class BarModule {
}
