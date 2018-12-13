import { NgModule } from '@angular/core';
import { IconComponent } from './icon.component';
import { MatIconModule, MatTooltipModule } from '@angular/material';
import { IconService } from './icon.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [IconComponent],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,
    MatIconModule,
    FlexLayoutModule,
    MatTooltipModule],
  exports: [IconComponent],
  providers: [IconService],
})
export class IconsModule {
}
