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
  cloneDeep,
} from 'lodash';
import { LIST_EL_HEIGHT } from '../list.consts';
import {
  ListOption,
  ListHeader,
  SelectGroupOption,
  SelectOption,
} from '../list.interface';
import {
  arrayInsertAt,
  arrayFlatten,
  isNullOrUndefined,
} from '../../../services/utils/functional-utils';

@Injectable()
export class ListModelService {
  constructor() {}

  getOptionsModel(
    options: SelectGroupOption[],
    listHeaders: ListHeader[],
    noGroupHeaders: boolean
  ): ListOption[] {
    const groupOptions = map(options, group => {
      const groupHeader: ListHeader = find(listHeaders, header =>
        this.isSameGroup(header, group)
      );
      const placeholder = Object.assign(
        {
          isPlaceHolder: true,
          groupName: group.groupName,
          value: group.groupName,
          id: group.groupName,
          selected: false,
        },
        !isNullOrUndefined(group.key) ? { key: group.key } : {}
      );

      let virtualOptions;

      if (noGroupHeaders) {
        virtualOptions = map(group.options, option =>
          assign(
            {},
            option,
            {
              groupName: group.groupName,
              isPlaceHolder: false,
            },
            !isNullOrUndefined(group.key) ? { key: group.key } : {}
          )
        );
      } else if (groupHeader.isCollapsed) {
        virtualOptions = placeholder;
      } else {
        virtualOptions = concat(
          placeholder,
          map(group.options, option =>
            assign(
              {},
              option,
              {
                groupName: group.groupName,
                isPlaceHolder: false,
                selected: option.selected,
              },
              !isNullOrUndefined(group.key) ? { key: group.key } : {}
            )
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

      return Object.assign(
        {
          groupName: group.groupName,
          isCollapsed: collapseHeaders,
          placeHolderSize: group.options.length * LIST_EL_HEIGHT,
          selected: selectedCount === group.options.length,
          indeterminate:
            selectedCount > 0 && selectedCount < group.options.length,
          selectedCount: selectedCount,
        },
        !isNullOrUndefined(group.key) ? { key: group.key } : {}
      );
    });
  }

  setSelectedOptions(
    listHeaders: ListHeader[],
    listOptions: ListOption[],
    options: SelectGroupOption[]
  ): void {
    const selectedIDs = this.getSelectedIDs(options);
    forEach(listOptions, option => {
      set(
        option,
        'selected',
        option.isPlaceHolder ? false : includes(selectedIDs, option.id)
      );
    });

    listHeaders.forEach((header: ListHeader) => {
      const groupOptions = options.find(group =>
        this.isSameGroup(header, group)
      ).options;

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
        // group.groupName.match(matcher) ||
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

  getSelectedIDs(options: SelectGroupOption[]): (number | string)[] {
    return arrayFlatten<string | number>(
      options.map(group =>
        group.options
          .filter((option: SelectOption) => option.selected)
          .map((optn: SelectOption) => optn.id)
      )
    );
  }

  countSelected(options: SelectOption[]): number {
    return options.filter(o => o.selected).length;
  }

  isIndeterminate(options: SelectOption[]): boolean {
    const selectedCount = this.countSelected(options);
    return selectedCount > 0 && selectedCount < options.length;
  }

  assignOptionSelectedValue(
    value: boolean,
    options: SelectGroupOption[],
    group: Partial<SelectGroupOption> = null,
    deepClone = false
  ): SelectGroupOption[] {
    if (group === null) {
      return options.map((grp: SelectGroupOption) =>
        Object.assign({}, grp, {
          options: grp.options.map((opt: SelectOption) =>
            Object.assign({}, opt, {
              selected: opt.disabled ? opt.selected : value,
            })
          ),
        })
      );
    }

    const groupIndex = options.findIndex(
      (grp: SelectGroupOption): boolean => this.isSameGroup(group, grp)
    );

    return arrayInsertAt(
      deepClone ? cloneDeep(options) : options,

      Object.assign({}, options[groupIndex], {
        options: options[groupIndex].options.map((opt: SelectOption) =>
          Object.assign({}, opt, {
            selected: opt.disabled ? opt.selected : value,
          })
        ),
      }),

      groupIndex,
      true
    );
  }

  selectAll(
    options: SelectGroupOption[],
    group: Partial<SelectGroupOption> = null
  ): SelectGroupOption[] {
    return this.assignOptionSelectedValue(true, options, group);
  }

  deselectAll(
    options: SelectGroupOption[],
    group: Partial<SelectGroupOption> = null
  ): SelectGroupOption[] {
    return this.assignOptionSelectedValue(false, options, group);
  }

  isSameGroup(
    group1: Partial<SelectGroupOption> | Partial<ListHeader>,
    group2: Partial<SelectGroupOption> | Partial<ListHeader>
  ): boolean {
    if (!group1 || !group2) {
      return false;
    }
    return (
      (!isNullOrUndefined(group1.key) && group1.key === group2.key) ||
      (isNullOrUndefined(group1.key) && group1.groupName === group2.groupName)
    );
  }
}
