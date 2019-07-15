import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { ButtonComponent } from './button/button.component';
import { SquareButtonComponent } from './square/square.component';
import { GroupComponent } from './group/group.component';
import { BackButtonComponent } from './back-button/back-button.component';
import { IconsModule } from '../../icons/icons.module';
import { CommonModule } from '@angular/common';
import { TextButtonComponent } from './text-button/text-button.component';
import { TypographyModule } from '../../typography/typography.module';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { OutsideZonePlugin } from '../../services/utils/eventManager.plugins';

@NgModule({
  declarations: [
    ButtonComponent,
    SquareButtonComponent,
    GroupComponent,
    BackButtonComponent,
    TextButtonComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatRippleModule,
    IconsModule,
    TypographyModule
  ],
  exports: [
    ButtonComponent,
    SquareButtonComponent,
    GroupComponent,
    BackButtonComponent,
    TextButtonComponent
  ],
  providers: [
    {
      multi: true,
      provide: EVENT_MANAGER_PLUGINS,
      useClass: OutsideZonePlugin
    }
  ]
})
export class ButtonsModule {}
