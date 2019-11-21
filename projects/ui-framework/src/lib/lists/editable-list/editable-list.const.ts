import { EditableListActions } from './editable-list.interface';

export const EDITABLE_LIST_MENU_LABELS = {
  edit: 'Edit',
  remove: 'Remove',
};

export const EDITABLE_LIST_ALLOWED_ACTIONS_DEF: EditableListActions = {
  sort: true,
  edit: true,
  add: true,
  remove: true,
};
