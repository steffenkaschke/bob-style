import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridLayoutExampleComponent } from './grid-layout-example.component';
import { TypographyModule } from '../../typography/typography.module';

@NgModule({
  declarations: [GridLayoutExampleComponent],
  imports: [CommonModule, TypographyModule],
  exports: [GridLayoutExampleComponent],
  providers: [],
})
export class GridLayoutExampleModule {}
