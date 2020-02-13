import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridLayoutExampleComponent } from './grid-layout-example.component';
import { TypographyModule } from '../../typography/typography.module';
import { PseudoInputModule } from '../../services/util-components/pseudo-input/pseudo-input.module';

@NgModule({
  declarations: [GridLayoutExampleComponent],
  imports: [CommonModule, TypographyModule, PseudoInputModule],
  exports: [GridLayoutExampleComponent],
  providers: [],
})
export class GridLayoutExampleModule {}
