import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableListComponent } from './editable-list.component';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';
import { IconsModule } from '../../icons/icons.module';
import { MenuModule } from '../../navigation/menu/menu.module';
import { ButtonsModule } from '../../buttons/buttons.module';

@NgModule({
  imports: [
    CommonModule,
    IconsModule,
    NgxSmoothDnDModule,
    MenuModule,
    ButtonsModule,
  ],
  declarations: [EditableListComponent],
  exports: [EditableListComponent],
})
export class EditableListModule {}