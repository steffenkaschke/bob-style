import { MenuItem } from '../../navigation/menu/menu.interface';

export interface EditableListViewItem {
  id: string | number;
  value: string;
  menu?: MenuItem[];
  readonly?: boolean;
  focused?: boolean;
  new?: boolean;
  deleted?: boolean;
  showRemoveConfirm?: boolean;
}

export interface EditableListActions {
  sort?: boolean;
  edit?: boolean;
  add?: boolean | string;
  remove?: boolean;
}
