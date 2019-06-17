import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightboxComponent } from './lightbox.component';
import { IconsModule } from '../../icons/icons.module';
import { LightboxService } from './lightbox-service/lightbox.service';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { TypographyModule } from '../../typography/typography.module';

@NgModule({
  declarations: [LightboxComponent],
  entryComponents: [LightboxComponent],
  imports: [CommonModule, IconsModule, ButtonsModule, TypographyModule],
  exports: [LightboxComponent],
  providers: [LightboxService]
})
export class LightboxModule {}
