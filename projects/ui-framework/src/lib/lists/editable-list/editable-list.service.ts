import { Injectable } from '@angular/core';
import { EditableListViewItem } from './editable-list.interface';
import { compareAsStrings } from '../../services/utils/functional-utils';
import { DropResult } from 'ngx-smooth-dnd';

@Injectable()
export class EditableListService {
  constructor() {}

  onItemMove = (list: EditableListViewItem[], dropResult: DropResult): EditableListViewItem[] => {
    const { removedIndex, addedIndex } = dropResult;
    if (removedIndex === addedIndex) {
      return null;
    }

    list.splice(addedIndex, 0, list.splice(removedIndex, 1)[0]);
    return list;
  };

  getItemIndexByID(id: string | number, list: EditableListViewItem[]): number {
    return list.findIndex(i => compareAsStrings(i.id, id));
  }

  getItemByID(id: string | number, list: EditableListViewItem[]): EditableListViewItem {
    return list.find(i => compareAsStrings(i.id, id));
  }
}
