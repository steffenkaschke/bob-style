import { Injectable } from '@angular/core';
import { MenuItem } from '../../navigation/menu/menu.interface';
import { EDITABLE_LIST_TRANSLATION } from './editable-list.const';
import { EditableListViewItem } from './editable-list.interface';
import {
  compareAsStrings,
  cloneArray,
} from '../../services/utils/functional-utils';
import { DropResult } from 'ngx-smooth-dnd';

@Injectable()
export class EditableListService {
  constructor() {}

  onItemMove = (list: EditableListViewItem[], dropResult: DropResult) => {
    const { removedIndex, addedIndex } = dropResult;

    if (removedIndex === addedIndex) {
      return false;
    }

    list.splice(addedIndex, 0, list.splice(removedIndex, 1)[0]);

    return list;
  };

  getItemIndexByID(id: string | number, list: EditableListViewItem[]): number {
    return list.findIndex(i => compareAsStrings(i.id, id));
  }

  getItemByID(
    id: string | number,
    list: EditableListViewItem[]
  ): EditableListViewItem {
    return list.find(i => compareAsStrings(i.id, id));
  }
}
