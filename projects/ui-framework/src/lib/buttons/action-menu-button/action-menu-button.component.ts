import { ButtonType } from '../../buttons/buttons.enum';
import { Icons, IconColor } from '../../icons/icons.enum';
import { Component, Input, OnInit } from '@angular/core';
import { assign, map } from 'lodash';
import { MenuItem } from '../../navigation/menu/menu.interface';

@Component({
  selector: 'b-action-menu-button',
  templateUrl: './action-menu-button.component.html',
  styleUrls: ['./action-menu-button.component.scss'],
})
export class ActionsMenuButtonComponent implements OnInit {
  @Input() menuItems: MenuItem[];
  @Input() openLeft: boolean;
  @Input() data: any;
  readonly buttonType: ButtonType = ButtonType.tertiary;
  readonly buttonColor: IconColor = IconColor.normal;
  readonly buttonIcon: Icons = Icons.three_dots_vert;

  constructor() { }

  ngOnInit() {
    this.menuItems = map(this.menuItems, (item: MenuItem) => {
      return assign({}, item, {
        action: () => {
          item.action(this.data);
        }
      });
    });
  }

}
