import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTableModule } from '@angular/cdk/table';
import { AgGridModule } from 'ag-grid-angular';
import {AvatarModule, ButtonsModule, MenuModule} from '../../public_api';
import { AvatarCellComponent } from './table-cell-components/avatar.component';
import { TableUtilsService } from './table-utils-service/table-utils.service';
import { LicenseManager } from 'ag-grid-enterprise';
import { ActionsCellComponent } from './table-cell-components/actions-cell/actions-cell.component';


@NgModule({
  declarations: [
    TableComponent,
    AvatarCellComponent,
    ActionsCellComponent
  ],
  providers: [
    TableUtilsService,
  ],
  imports: [
    CommonModule,
    DragDropModule,
    CdkTableModule,
    AvatarModule,
    AgGridModule,
    ButtonsModule,
    MenuModule,
    AgGridModule.withComponents([AvatarCellComponent, ActionsCellComponent]),
  ],
  exports: [
    TableComponent,
    AvatarCellComponent,
    ActionsCellComponent
  ],
})
export class TableModule {

  constructor() {
    LicenseManager.setLicenseKey("hibob_Bob_1Devs_1Deployment_23_April_2020__MTU4NzU5NjQwMDAwMA==5b77134bf43e27e7f8ccb20bdfa3c155");
  }
}
