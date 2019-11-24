import { Injectable } from '@angular/core';
import { EditableListViewItem, EditableListActions, EditableListTranslation } from './editable-list.interface';
import { compareAsStrings, simpleUID } from '../../services/utils/functional-utils';
import { DropResult } from 'ngx-smooth-dnd';
import { MenuItem } from '../../navigation/menu/menu.interface';
import { SelectOption } from '../list.interface';

@Injectable()
export class EditableListService {
  constructor() {}

  getItemIndexByID(id: string | number, list: EditableListViewItem[]): number {
    return list.findIndex(i => compareAsStrings(i.id, id));
  }

  getItemByID(id: string | number, list: EditableListViewItem[]): EditableListViewItem {
    return list.find(i => compareAsStrings(i.id, id));
  }

  getItemMenu(allowedActions: EditableListActions, translation: EditableListTranslation): MenuItem[] {
    const menu: MenuItem[] = [];
    if (allowedActions.edit) {
      menu.push({
        label: translation.edit,
        key: 'itemEditStart',
      });
    }
    if (allowedActions.remove) {
      menu.push({
        label: translation.remove,
        key: 'removeItem',
      });
    }
    return menu;
  }

  initListViewModel(
    list: SelectOption[],
    allowedActions: EditableListActions,
    translation: EditableListTranslation
  ): EditableListViewItem[] {
    return list.map((item: SelectOption) => ({
      ...item,
      readonly: true,
      focused: false,
      menu: (allowedActions.edit || allowedActions.remove) && this.getItemMenu(allowedActions, translation),
    }));
  }

  updateListItemMenus(
    list: EditableListViewItem[],
    allowedActions: EditableListActions,
    translation: EditableListTranslation
  ): EditableListViewItem[] {
    list.forEach(item => {
      item.menu = (allowedActions.edit || allowedActions.remove) && this.getItemMenu(allowedActions, translation);
    });
    return list;
  }

  onItemMove(list: EditableListViewItem[], dropResult: DropResult): EditableListViewItem[] {
    const { removedIndex, addedIndex } = dropResult;
    if (removedIndex === addedIndex) {
      return null;
    }

    list.splice(addedIndex, 0, list.splice(removedIndex, 1)[0]);
    return list;
  }

  addItem(
    list: EditableListViewItem[],
    allowedActions: EditableListActions,
    translation: EditableListTranslation
  ): EditableListViewItem[] {
    list.unshift({
      id: simpleUID('new-'),
      value: '',
      readonly: false,
      focused: true,
      new: true,
      menu: (allowedActions.edit || allowedActions.remove) && this.getItemMenu(allowedActions, translation),
    });
    return list;
  }
}
