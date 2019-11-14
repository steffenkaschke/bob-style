import { Injectable } from '@angular/core';
import { ListChange } from './list-change';
import { SelectGroupOption } from '../list.interface';
import { assign, chain, includes, map } from 'lodash';

@Injectable()
export class ListChangeService {

  getListChange(
    options: SelectGroupOption[],
    selectedIDs: (string | number)[],
  ): ListChange {
    const currentOptions = this.getCurrentSelectGroupOptions(options, selectedIDs);
    return new ListChange(currentOptions);
  }

  private getCurrentSelectGroupOptions(
    options: SelectGroupOption[],
    selectedIDs: (string | number)[],
  ): SelectGroupOption[] {
    return map(options, g => assign({}, g, {
      options: map(g.options, o => assign({}, o, {
        selected: includes(selectedIDs, o.id),
      })),
    }));
  }
}
