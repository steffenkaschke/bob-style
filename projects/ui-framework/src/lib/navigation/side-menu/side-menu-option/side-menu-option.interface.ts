import { MenuItem } from '../../../overlay/menu/menu.interface';

export interface SideMenuOption {
  id: string;
  displayName: string;
  prefix?: OptionComponent;
  actions?: MenuItem[];
}

export interface OptionComponent {
  component: any;
  attributes: any;
}
