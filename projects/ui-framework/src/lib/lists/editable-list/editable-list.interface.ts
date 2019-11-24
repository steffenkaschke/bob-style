import { MenuItem } from '../../navigation/menu/menu.interface';

export interface EditableListViewItem {
  id: string | number;
  value: string;
  menu?: MenuItem[];
  readonly?: boolean;
  focused?: boolean;
  new?: boolean;
  showRemoveConfirm?: boolean;
  warn?: boolean;
  error?: boolean;
}

export interface EditableListActions {
  sort?: boolean;
  edit?: boolean;
  add?: boolean | string;
  remove?: boolean;
}

export interface EditableListTranslation {
  add: string;
  edit: string;
  remove: string;
  cancel: string;
  sortAsc: string;
  sortDesc: string;
  sortCustom: string;
  alreadyExists: string[];
  duplicate: string;
}
