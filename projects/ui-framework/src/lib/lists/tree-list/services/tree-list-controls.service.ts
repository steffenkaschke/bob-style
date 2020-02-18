import { Injectable } from '@angular/core';
import { Keys } from '../../../enums';
import { isKey } from '../../../services/utils/functional-utils';
import { TreeListItem, TreeListItemMap, itemID } from '../tree-list.interface';

@Injectable()
export class TreeListControlsService {
  constructor() {}

  public onListClick(
    event: MouseEvent,
    config: {
      itemsMap: TreeListItemMap;
      listViewModel: itemID[];
      toggleItemCollapsed: (item: TreeListItem, element: HTMLElement) => void;
      toggleItemSelect: (item: TreeListItem, index: number) => void;
      itemClick: (item: TreeListItem, element: HTMLElement) => void;
    }
  ): void {
    const {
      itemsMap,
      listViewModel,
      toggleItemCollapsed,
      toggleItemSelect,
      itemClick,
    } = config;

    const target = event.target as HTMLElement;
    const itemElement = target.closest('.bhl-item') as HTMLElement;
    const index = parseInt(itemElement.getAttribute('data-index'), 10);
    const item: TreeListItem = itemsMap.get(listViewModel[index]);

    if (target.matches('.bhl-item-checkbox')) {
      event.stopPropagation();
      return toggleItemSelect(item, index);
    }

    if (target.matches('.bhl-item-chevron')) {
      event.stopPropagation();
      return toggleItemCollapsed(item, itemElement);
    }

    console.log(itemElement);

    itemClick(item, itemElement);
  }

  public onListKeyDown(
    event: KeyboardEvent,
    config: {
      itemsMap: TreeListItemMap;
      listViewModel: itemID[];
      toggleItemCollapsed: (item: TreeListItem, element: HTMLElement) => void;
      toggleItemSelect: (item: TreeListItem, index: number) => void;
    }
  ): void {
    console.log(event);

    const {
      itemsMap,
      listViewModel,
      toggleItemCollapsed,
      toggleItemSelect,
    } = config;

    if (
      ![
        Keys.arrowup,
        Keys.arrowdown,
        Keys.arrowleft,
        Keys.arrowright,
        Keys.space,
        Keys.enter,
        Keys.tab,
        // Keys.escape,
      ].includes(event.key as Keys)
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLElement;
    const itemElement = target.closest('.bhl-item') as HTMLElement;
    const index = parseInt(itemElement.getAttribute('data-index'), 10);
    const item: TreeListItem = itemsMap.get(listViewModel[index]);

    if (
      isKey(event.key, Keys.arrowdown) ||
      (isKey(event.key, Keys.tab) && !event.shiftKey) ||
      (isKey(event.key, Keys.arrowright) &&
        (!item.childrenCount || (item.childrenCount && !item.collapsed)))
    ) {
      const nextItemElement = itemElement.nextElementSibling as HTMLElement;
      if (nextItemElement) {
        nextItemElement.focus();
      }
      return;
    }

    if (
      isKey(event.key, Keys.arrowup) ||
      (isKey(event.key, Keys.tab) && event.shiftKey) ||
      (isKey(event.key, Keys.arrowleft) &&
        (!item.childrenCount || item.collapsed))
    ) {
      const prevItemElement = itemElement.previousElementSibling as HTMLElement;
      if (prevItemElement) {
        prevItemElement.focus();
      }
      return;
    }

    if (
      isKey(event.key, Keys.arrowright) &&
      item.childrenCount &&
      item.collapsed
    ) {
      return toggleItemCollapsed(item, itemElement);
    }

    if (
      isKey(event.key, Keys.arrowleft) &&
      item.childrenCount &&
      !item.collapsed
    ) {
      return toggleItemCollapsed(item, itemElement);
    }

    if (isKey(event.key, Keys.space) || isKey(event.key, Keys.enter)) {
      return toggleItemSelect(item, index);
    }
  }
}
