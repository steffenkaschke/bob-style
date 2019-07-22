import { chain, concat, map } from 'lodash';
import { GroupOption, SelectGroupOption } from '../list.interface';

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

  getSelected(): GroupOption[] {
    return chain(this.selectGroupOptions)
      .reduce(
        (selected, group) =>
          concat(
            selected,
            map(group.options, option => ({ option,  groupName: group.groupName, key: group.key }))
          ),
        [],
      )
      .filter(groupOption => groupOption.option.selected)
      .map(groupOption => ({
        id: groupOption.option.id,
        groupName: groupOption.groupName,
        groupKey: groupOption.key || null
      }))
      .value();
  }
}
