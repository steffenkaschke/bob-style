import { NgModule } from '@angular/core';
import { IconComponent } from './icon.component';
import { CommonModule } from '@angular/common';

@NgModule({
  entryComponents: [IconComponent],
  declarations: [IconComponent],
  imports: [CommonModule],
  exports: [IconComponent],
  providers: []
})
export class IconsModule {}
