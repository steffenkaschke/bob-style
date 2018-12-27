import { NgModule } from '@angular/core';
import { MatIconModule, MatTooltipModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconComponent } from './icon.component';
import { IconService } from './icon.service';

@NgModule({
  declarations: [IconComponent],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,
    MatIconModule,
    FlexLayoutModule,
    MatTooltipModule],
  exports: [
    IconComponent,
  ],
  providers: [IconService],
})
export class IconsModule {
}
