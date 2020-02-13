import { SelectGroupOption } from '../list.interface';
import { arrayFlatten } from '../../services/utils/functional-utils';

export class ListChange {
  public readonly selectGroupOptions: SelectGroupOption[];
  public readonly selectedIDs: (string | number)[];

  constructor(
    selectedGroupOptionsSrc: SelectGroupOption[],
    selectedIDsSrc: (string | number)[] = null
  ) {
    this.selectGroupOptions = selectedGroupOptionsSrc;
    this.selectedIDs = selectedIDsSrc || this.getSelIds();
  }

  getSelectGroupOptions(): SelectGroupOption[] {
    return this.selectGroupOptions;
  }

  getSelectedIds(): (number | string)[] {
    return this.selectedIDs;
  }

  getSelectedGroupOptions(): SelectGroupOption[] {
    return this.selectGroupOptions
      .map((group: SelectGroupOption) => ({
        ...group,
        options: group.options.filter(option => option.selected),
      }))
      .filter(group => group.options.length);
  }

  getDisplayValue(): string {
    return arrayFlatten(this.selectGroupOptions.map(group => group.options))
      .filter(option => option.selected)
      .map(option => option.value)
      .join(', ');
  }

  private getSelIds(): (number | string)[] {
    return arrayFlatten(this.selectGroupOptions.map(group => group.options))
      .filter(option => option.selected)
      .map(option => option.id);
  }
}
