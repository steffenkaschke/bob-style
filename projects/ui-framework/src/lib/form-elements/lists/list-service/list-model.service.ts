import { Injectable } from '@angular/core';
import {
  flatten,
  forEach,
  map,
  concat,
  assign,
  find,
  set,
  includes,
  filter,
  escapeRegExp,
  some,
  compact,
  chain,
} from 'lodash';
import { LIST_EL_HEIGHT } from '../list.consts';
import {
  ListOption,
  ListHeader,
  SelectGroupOption,
  SelectOption,
} from '../list.interface';

@Injectable()
export class ListModelService {
  constructor() {}

  getOptionsModel(
    options: SelectGroupOption[],
    listHeaders: ListHeader[],
    noGroupHeaders: boolean
  ): ListOption[] {
    const groupOptions = map(options, group => {
      const groupHeader: ListHeader = find(
        listHeaders,
        header => header.groupName === group.groupName
      );
      const placeholder = {
        isPlaceHolder: true,
        groupName: group.groupName,
        value: group.groupName,
        id: group.groupName,
        selected: false,
      };

      let virtualOptions;

      if (noGroupHeaders) {
        virtualOptions = map(group.options, option =>
          assign({}, option, {
            groupName: group.groupName,
            isPlaceHolder: false,
          })
        );
      } else if (groupHeader.isCollapsed) {
        virtualOptions = placeholder;
      } else {
        virtualOptions = concat(
          placeholder,
          map(group.options, option =>
            assign({}, option, {
              groupName: group.groupName,
              isPlaceHolder: false,
              selected: option.selected,
            })
          )
        );
      }
      return virtualOptions;
    });
    return flatten(groupOptions);
  }

  getHeadersModel(
    options: SelectGroupOption[],
    collapseHeaders = false
  ): ListHeader[] {
    return map(options, group => {
      const selectedCount = this.countSelected(group.options);

      return {
        groupName: group.groupName,
        isCollapsed: collapseHeaders,
        placeHolderSize: group.options.length * LIST_EL_HEIGHT,
        selected: selectedCount === group.options.length,
        indeterminate:
          selectedCount > 0 && selectedCount < group.options.length,
        selectedCount: selectedCount,
      };
    });
  }

  setSelectedOptions(
    listHeaders: ListHeader[],
    listOptions: ListOption[],
    options: SelectGroupOption[]
  ): void {
    const selectedIdsMap = this.getSelectedIdsMap(options);
    forEach(listOptions, option => {
      set(
        option,
        'selected',
        option.isPlaceHolder ? false : includes(selectedIdsMap, option.id)
      );
    });
    forEach(listHeaders, header => {
      const groupOptions = chain(options)
        .filter(group => group.groupName === header.groupName)
        .flatMap('options')
        .value();

      header.selectedCount = this.countSelected(groupOptions);
      header.selected = header.selectedCount === groupOptions.length;
      header.indeterminate =
        header.selectedCount > 0 && header.selectedCount < groupOptions.length;
    });
  }

  getFilteredOptions(
    options: SelectGroupOption[],
    searchValue: string
  ): SelectGroupOption[] {
    const matcher = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredOptions = map(options, group => {
      const filteredGroup =
        group.groupName.match(matcher) ||
        some(group.options, option => option.value.match(matcher))
          ? assign({}, group, {
              options: filter(group.options, option =>
                option.value.match(matcher)
              ),
            })
          : null;
      return filteredGroup;
    });
    return compact(filteredOptions);
  }

  getSelectedIdsMap(options: SelectGroupOption[]): (number | string)[] {
    return chain(options)
      .flatMap('options')
      .filter(o => o.selected)
      .flatMap('id')
      .value();
  }

  countSelected(options: SelectOption[]): number {
    return options.filter(o => o.selected).length;
  }

  isIndeterminate(options: SelectOption[]): boolean {
    const selectedCount = this.countSelected(options);
    return selectedCount > 0 && selectedCount < options.length;
  }
}
