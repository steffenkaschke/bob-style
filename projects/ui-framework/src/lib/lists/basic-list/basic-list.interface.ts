import { Icons } from '../../icons/icons.enum';
import { MenuItem } from '../../navigation/menu/menu.interface';

export interface BasicListItem {
  label: string;
  icon: Icons;
  menu?: MenuItem[];
}
