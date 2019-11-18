import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicListComponent } from './basic-list.component';
import { MenuModule } from '../../../navigation/menu/menu.module';
import { IconsModule } from '../../../icons/icons.module';
import { TypographyModule } from '../../../typography/typography.module';
import { ButtonsModule } from '../../../buttons/buttons.module';

@NgModule({
  declarations: [
    BasicListComponent,
  ],
  imports: [
    CommonModule,
    IconsModule,
    MenuModule,
    TypographyModule,
    ButtonsModule,
  ],
  exports: [
    BasicListComponent
  ],
})
export class BasicListModule { }
