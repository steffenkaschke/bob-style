import { Injectable, OnDestroy } from '@angular/core';
import {
  flatten, forEach, map, concat, assign, find, set, includes, filter, every, escapeRegExp, some, compact, chain
} from 'lodash';
import { LIST_EL_HEIGHT } from '../list.consts';
import { ListOption, ListHeader, SelectGroupOption } from '../list.interface';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class ListModelService implements OnDestroy {

  public modelHandler$: ReplaySubject<boolean> = new ReplaySubject();

  constructor() {
  }

  public getModelHandlerSubscription(): ReplaySubject<boolean> {
    if (!this.modelHandler$) {
      this.initHandlerSubscription();
    }
    return this.modelHandler$;
  }

  private initHandlerSubscription() {
    this.modelHandler$ = new ReplaySubject<boolean>(1);
  }


  public isCollapsedChange(value: boolean): void {
    this.modelHandler$.next(value);
  }

  public ngOnDestroy(): void {
    if (this.modelHandler$) {
      this.modelHandler$.unsubscribe();
    }
  }

  getOptionsModel(
    options: SelectGroupOption[],
    listHeaders: ListHeader[],
    noGroupHeaders: boolean,
  ): ListOption[] {
    const groupOptions = map(options, (group) => {
      const groupHeader: ListHeader = find(listHeaders, header => header.groupName === group.groupName);
      const placeholder = {
        isPlaceHolder: true,
        groupName: group.groupName,
        value: group.groupName,
        id: group.groupName,
        selected: null,
      };

      let virtualOptions;

      if (noGroupHeaders) {
        virtualOptions = map(group.options, option => assign(
          {},
          option,
          {
            groupName: group.groupName,
            isPlaceHolder: false,
          },
        ));
      } else if (groupHeader.isCollapsed) {
        virtualOptions = placeholder;
      } else {
        virtualOptions = concat(
          placeholder,
          map(group.options, option => assign(
            {},
            option,
            {
              groupName: group.groupName,
              isPlaceHolder: false,
              selected: option.selected,
            },
          )),
        );
      }
      return virtualOptions;
    });
    return flatten(groupOptions);
  }

  getHeadersModel(options: SelectGroupOption[], collapsedIndicator = true): ListHeader[] {
    return map(options, group => ({
      groupName: group.groupName,
      isCollapsed: collapsedIndicator,
      placeHolderSize: group.options.length * LIST_EL_HEIGHT,
      selected: null,
    }));
  }

  setSelectedOptions(
    listHeaders: ListHeader[],
    listOptions: ListOption[],
    selectedIdsMap: (string | number)[],
  ): void {
    forEach(listOptions, option => {
      set(option, 'selected', option.isPlaceHolder
        ? null
        : includes(selectedIdsMap, option.id));
    });
    forEach(listHeaders, header => {
      const groupOptions = filter(listOptions, option =>
        option.groupName === header.groupName &&
        !option.isPlaceHolder);
      set(header, 'selected', header.isCollapsed
        ? header.selected
        : every(groupOptions, ['selected', true]));
    });
  }

  getFilteredOptions(
    options: SelectGroupOption[],
    s: string,
  ): SelectGroupOption[] {
    const matcher = new RegExp(escapeRegExp(s), 'i');
    const filteredOptions = map(options, (group) => {
      const filteredGroup = group.groupName.match(matcher) || some(group.options, option => option.value.match(matcher))
        ? assign({}, group, { options: filter(group.options, option => option.value.match(matcher)) })
        : null;
      return filteredGroup;
    });
    this.isCollapsedChange(false);
    return compact(filteredOptions);
  }

  getSelectedIdsMap(options: SelectGroupOption[]): (number | string)[] {
    return chain(options)
      .flatMap('options')
      .filter(o => o.selected)
      .flatMap('id')
      .value();
  }
}
