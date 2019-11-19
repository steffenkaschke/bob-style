import { Injectable } from '@angular/core';
import { ListChange } from './list-change';
import { SelectGroupOption } from '../list.interface';
import { asArray } from '../../../services/utils/functional-utils';

@Injectable()
export class ListChangeService {
  getListChange(
    options: SelectGroupOption[],
    selectedIdsMap: (string | number)[]
  ): ListChange {
    const currentOptions = this.getCurrentSelectGroupOptions(
      options,
      selectedIdsMap
    );
    return new ListChange(currentOptions, selectedIdsMap);
  }

  private getCurrentSelectGroupOptions(
    options: SelectGroupOption[],
    selectedIdsMap: (string | number)[]
  ): SelectGroupOption[] {
    return options.map((grp: SelectGroupOption) => ({
      ...grp,
      options: grp.options.map(optn => ({
        ...optn,
        selected: asArray(selectedIdsMap).includes(optn.id),
      })),
    }));
  }
}
