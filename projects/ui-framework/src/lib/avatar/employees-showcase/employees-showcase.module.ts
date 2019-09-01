import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesShowcaseComponent } from './employees-showcase.component';
import { AvatarModule } from '../avatar/avatar.module';
import { IconsModule } from '../../icons/icons.module';
import { PanelModule } from '../../popups/panel/panel.module';
import { SingleListModule } from '../../form-elements/lists/single-list/single-list.module';

@NgModule({
  declarations: [EmployeesShowcaseComponent],
  imports: [CommonModule, AvatarModule, IconsModule, PanelModule, SingleListModule],
  exports: [EmployeesShowcaseComponent],
  entryComponents: []
})
export class EmployeesShowcaseModule {
}