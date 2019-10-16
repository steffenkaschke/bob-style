import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { assign, map } from 'lodash';

import { Icons, IconColor } from '../../../../../src/lib/icons/icons.enum';
import { ButtonType } from '../../../../../src/lib/buttons/buttons.enum';
import { MenuItem } from '../../../../../src/lib/navigation/menu/menu.interface';

@Component({
  selector: 'b-actions-cell',
  templateUrl: './actions-cell.component.html',
})
export class ActionsCellComponent implements ICellRendererAngularComp {
  public menuItems: MenuItem[];
  public openLeft: boolean;
  readonly buttonType: ButtonType = ButtonType.tertiary;
  readonly buttonColor: IconColor = IconColor.normal;
  readonly buttonIcon: Icons = Icons.three_dots_vert;

  constructor() { }

  agInit(params: any): void {
    this.openLeft = params.value.openLeft || false;
    this.menuItems = map(params.value.menuItems, (item: MenuItem) => {
      return assign({}, item, {
        action: () => {
          item.action(params.data);
        }
      });
    });
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
