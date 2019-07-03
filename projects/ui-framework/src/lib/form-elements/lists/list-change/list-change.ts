import { chain, concat, map } from 'lodash';
import { SelectGroupOption } from '../list.interface';

export class ListChange {
  private readonly selectGroupOptions: SelectGroupOption[];

  constructor(
    selectedGroupOptionsSrc: SelectGroupOption[],
  ) {
    this.selectGroupOptions = selectedGroupOptionsSrc;
  }

  getSelectGroupOptions(): SelectGroupOption[] {
    return this.selectGroupOptions;
  }

  getSelectedIds(): (number | string)[] {
    return chain(this.selectGroupOptions)
      .flatMap('options')
      .filter(o => o.selected)
      .flatMap('id')
      .value();
  }

  getSelected(): { id: number | string; groupName: string }[] {
    return chain(this.selectGroupOptions)
      .reduce(
        (selected, group) =>
          concat(
            selected,
            map(group.options, option => ({ option,  groupName: group.groupName }))
          ),
        [],
      )
      .filter(groupOption => groupOption.option.selected)
      .map(groupOption => ({ id: groupOption.option.id, groupName: groupOption.groupName }))
      .value();
  }
}
