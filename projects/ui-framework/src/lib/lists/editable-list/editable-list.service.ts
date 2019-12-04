import { Injectable } from '@angular/core';
import {
  EditableListActions,
  EditableListTranslation,
} from './editable-list.interface';
import {
  compareAsStrings,
  simpleUID,
} from '../../services/utils/functional-utils';
import { DropResult } from 'ngx-smooth-dnd';

import { SelectOption } from '../list.interface';

@Injectable()
export class EditableListService {
  constructor() {}

  getItemIndexByID(id: string | number, list: SelectOption[]): number {
    return list.findIndex(i => compareAsStrings(i.id, id));
  }

  getItemByID(id: string | number, list: SelectOption[]): SelectOption {
    return list.find(i => compareAsStrings(i.id, id));
  }

  onItemMove(list: SelectOption[], dropResult: DropResult): SelectOption[] {
    const { removedIndex, addedIndex } = dropResult;
    if (removedIndex === addedIndex) {
      return null;
    }

    list.splice(addedIndex, 0, list.splice(removedIndex, 1)[0]);
    return list;
  }

  addItem(
    list: SelectOption[],
    allowedActions: EditableListActions,
    translation: EditableListTranslation
  ): SelectOption[] {
    list.unshift({
      id: simpleUID('new-'),
      value: '',
    });
    return list;
  }
}
