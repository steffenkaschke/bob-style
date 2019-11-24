import { MenuItem } from '../../navigation/menu/menu.interface';

export interface EditableListViewItem {
  id: string | number;
  value: string;
  menu?: MenuItem[];
  readonly?: boolean;
  focused?: boolean;
}

export interface EditableListActions {
  sort?: boolean;
  drag?: boolean;
  edit?: boolean;
  add?: boolean | string;
  remove?: boolean;
}

// remove this
