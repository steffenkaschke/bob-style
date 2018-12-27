import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UIFrameworkConfig } from './ui-framework.types';
import { AvatarComponent } from './avatar/avatar.component';
import { ButtonsModule } from './buttons/buttons.module';
import { TypographyModule } from './typography/typography.module';
import { IconsModule } from './icons/icons.module';
import { InputModule } from './input/input.module';

export const UI_FRAMEWORK_CONFIG = new InjectionToken<UIFrameworkConfig>('UI Framework config');
@NgModule({
  declarations: [
    AvatarComponent,
  ],
  imports: [
    BrowserModule,
    ButtonsModule,
    TypographyModule,
    IconsModule,
    InputModule,
  ],
  exports: [
    AvatarComponent,
    ButtonsModule,
    TypographyModule,
    IconsModule,
    InputModule,
  ]
})
export class UIFrameworkModule {
  static init(config: UIFrameworkConfig): ModuleWithProviders {
    return {
      ngModule: UIFrameworkModule,
      providers: [{
        provide: UI_FRAMEWORK_CONFIG, useValue: config
      }]
    };
  }
}
