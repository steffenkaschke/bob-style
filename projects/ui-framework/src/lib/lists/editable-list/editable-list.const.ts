import {
  EditableListActions,
  EditableListTranslation,
} from './editable-list.interface';

export const EDITABLE_LIST_TRANSLATION: EditableListTranslation = {
  add: 'Add',
  remove: 'Remove',
  cancel: 'Cancel',
  sortAsc: 'A - Z',
  sortDesc: 'Z - A',
  sortCustom: 'Custom',
  alreadyExists: ['Item', 'already exists'],
  duplicate: 'Duplicate item',
};

export const EDITABLE_LIST_ALLOWED_ACTIONS_DEF: EditableListActions = {
  sort: true,
  add: true,
  remove: true,
};
