import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../../icons/icons.module';
import { InputModule } from '../../form-elements/input/input.module';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';

@NgModule({
  declarations: [SearchComponent],
  imports: [CommonModule, IconsModule, InputModule],
  exports: [SearchComponent],
  providers: [EventManagerPlugins[0]],
})
export class SearchModule {}
