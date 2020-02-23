import { Injectable } from '@angular/core';
import {
  TreeListItemMap,
  TreeListOption,
  TreeListItem,
  itemID,
  ViewFilter,
} from '../tree-list.interface';
import {
  isNotEmptyArray,
  isNullOrUndefined,
  isRegExp,
  stringToRegex,
  arrayIntersection,
  cloneDeepSimpleObject,
  objectRemoveKey,
} from '../../../services/utils/functional-utils';
import { GenericObject } from '../../../types';

@Injectable()
export class TreeListModelService {
  private counter = 0;
  private maxItems = 5000;

  public getListViewModel(
    list: TreeListOption[],
    map: TreeListItemMap,
    viewFilter: ViewFilter = {},
    expand = false
  ): itemID[] {
    const addIDs = (items: TreeListOption[]): itemID[] => {
      let model = [];

      for (const item of items) {
        const itemData = map.get(this.getItemId(item));

        if (this.itemFilter(itemData, viewFilter)) {
          model.push(itemData.id);

          // console.log(
          //   'id',
          //   itemData.id,
          //   'item',
          //   item,
          //   'item from map',
          //   itemData
          // );

          if (item.children && (!itemData.collapsed || expand)) {
            const childrenModel = addIDs(item.children);

            if (childrenModel.length) {
              model = model.concat(childrenModel);
            } else {
              model.pop();
            }
          }
        }
      }

      return model;
    };

    return addIDs(list);
  }

  public getListItemsMap(
    list: TreeListOption[],
    map: TreeListItemMap = new Map(),
    separator = ' / ',
    collapsed = false
  ): TreeListItemMap {
    this.counter = 0;

    if (!list) {
      return map;
    }

    const rootItem: TreeListItem = {
      id: '#root',
      name: '#root',

      collapsed: collapsed,
      // selected: false,

      parentIDs: null,
      childrenIDs: [],

      parentCount: 0,
      selectedCount: 0,
    };

    for (const item of list) {
      ++this.counter;
      const itemId = this.getItemId(item);
      const converted = this.convertItem(item, map, ['#root'], collapsed);

      if (!converted) {
        break;
      }

      rootItem.childrenIDs.push(itemId);
      this.updateMap(map, itemId, converted);
    }

    rootItem.childrenCount = rootItem.childrenIDs.length;
    this.updateMap(map, rootItem.id, rootItem);

    const sprtrReg = new RegExp(separator, 'gi');

    for (const item of map.values()) {
      // pass values array same as parentIDs !!! and build value in convertItem

      item.value = isNotEmptyArray(item.parentIDs)
        ? item.parentIDs
            .map(id => map.get(id).name.replace(sprtrReg, '-'))
            .concat(item.name.replace(sprtrReg, '-'))
            .slice(1)
            .join(separator)
        : item.name;
      // if (isNullOrUndefined(item.id)) {
      //   item.id = item.value;
      // }

      item.tooltipText = item.value.replace(
        new RegExp(separator, 'gi'),
        ` ${separator} \n`
      );
    }

    return map;
  }

  private convertItem(
    item: TreeListOption,
    map: TreeListItemMap,
    parentIDs: itemID[] = null,
    collapsed = false,
    set: GenericObject = {}
  ): TreeListItem {
    // let selectedCount = 0;

    if (this.counter > this.maxItems) {
      console.error(
        `[TreeListModelService]: List too complex! List with more than ${this.maxItems} items are not supported. Truncating to first ${this.maxItems} items.`
      );
      return;
    }

    // console.log('item.id', item.id);

    const converted: TreeListItem = {
      ...objectRemoveKey(item, 'children'),
      id: this.getItemId(item), // add alt id from name/value/parentIDs!
      name: item.name,
      disabled: item.disabled || false,
      selected: item.selected || false,
      focused: false,
      parentIDs: parentIDs,
      childrenIDs: null,
      ...set,
    };

    if (isNotEmptyArray(item.children)) {
      converted.childrenIDs = [];

      for (const itm of item.children) {
        ++this.counter;
        const cnvrtd = this.convertItem(
          itm,
          map,
          [...(parentIDs || []), converted.id],
          collapsed,
          {
            disabled: itm.disabled || converted.disabled,
            selected: itm.selected || converted.selected,
          }
        );
        if (!cnvrtd) {
          break;
        }
        cnvrtd.parentCount = cnvrtd.parentIDs.length;
        converted.childrenIDs.push(cnvrtd.id);
        this.updateMap(map, cnvrtd.id, cnvrtd);
      }
    } else {
    }

    if (converted.childrenIDs) {
      converted.collapsed = collapsed;
      converted.childrenCount = converted.childrenIDs.length;
      // converted.selectedCount = selectedCount;
      converted.indeterminate =
        !!converted.selectedCount &&
        converted.selectedCount !== converted.childrenCount;
    }
    // else if (converted.selected) {
    //   selectedCount = selectedCount + 1;
    // }

    return converted;
  }

  private itemFilter(item: TreeListItem, viewFilter: ViewFilter = {}): boolean {
    let result = true;

    if (viewFilter.hide) {
      if (
        viewFilter.hide.prop &&
        item[viewFilter.hide.prop.key] === viewFilter.hide.prop.value
      ) {
        result = false;
      }

      if (viewFilter.hide.search) {
        const regex: RegExp = isRegExp(viewFilter.show.search)
          ? viewFilter.show.search
          : stringToRegex(viewFilter.show.search);

        if (regex.test(item[viewFilter.hide.searchBy || 'name'])) {
          result = false;
        }
      }
    }

    if (viewFilter.show) {
      if (
        viewFilter.show.prop &&
        item[viewFilter.show.prop.key] !== viewFilter.show.prop.value
      ) {
        result = false;
      }

      if (viewFilter.show.search) {
        if (item.childrenCount) {
          result = true;
        } else {
          const regex: RegExp = isRegExp(viewFilter.show.search)
            ? viewFilter.show.search
            : stringToRegex(viewFilter.show.search);

          if (!regex.test(item[viewFilter.show.searchBy || 'name'])) {
            result = false;
          }
        }
      }
    }

    return result;
  }

  public getSearchViewFilter(searchValue: string): ViewFilter {
    return {
      show: {
        search: stringToRegex(searchValue),
        searchBy: 'name',
      },
    };
  }

  private updateMap(
    map: TreeListItemMap,
    key: itemID,
    value: TreeListItem
  ): TreeListItemMap {
    return map.set(key, Object.assign(map.get(key) || {}, value));
  }

  private getItemId(item: TreeListOption): itemID {
    if (isNullOrUndefined(item.id)) {
      console.error(
        `[TreeListModelService]: Item "${item.name}" does not have a unique ID! Every item list should have one. Item name will be used in place of ID, but proper behaviour is not guaranteed.`
      );
    }
    return (!isNullOrUndefined(item.id) && item.id) || item.name;
  }
}
