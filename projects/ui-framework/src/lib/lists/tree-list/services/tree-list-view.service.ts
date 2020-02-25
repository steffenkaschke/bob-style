import { Injectable } from '@angular/core';
import {
  TreeListItem,
  itemID,
  TreeListItemMap,
  TreeListItemViewContext,
} from '../tree-list.interface';
import {
  isEmptyArray,
  stringify,
} from '../../../services/utils/functional-utils';
import { LIST_EL_HEIGHT } from '../../list.consts';

interface TreeListScrollToItemConfig {
  listViewModel: itemID[];
  listElement: HTMLElement;
  itemsMap: TreeListItemMap;
  updateListViewModel: (expand: boolean) => void;
}

@Injectable()
export class TreeListViewService {
  //
  // returns true if listViewModel was updated
  public scrollToItem(
    item: TreeListItem,
    config: TreeListScrollToItemConfig
  ): boolean {
    const {
      listViewModel,
      listElement,
      itemsMap,
      updateListViewModel,
    } = config;

    let viewModelWasUpdated = false;

    if (isEmptyArray(listViewModel)) {
      return viewModelWasUpdated;
    }

    let indexInView = listViewModel.findIndex(id => id === item.id);

    console.log(`
      scrollToItem: ${stringify(item)},
      item.parentIDs.length: ${item.parentIDs.length}
    `);

    if (indexInView === -1 && item.parentIDs.length > 1) {
      item.parentIDs.forEach(groupID => {
        itemsMap.get(groupID).collapsed = false;
      });
      console.log('----- scrollToItem calls updateListViewModel ------');
      updateListViewModel(false);
      viewModelWasUpdated = true;

      indexInView = listViewModel.findIndex(id => {
        console.log('checking id', id);
        return id === item.id;
      });
    }

    if (indexInView === -1) {
      console.error(
        `[TreeListComponent.scrollToItem]: Item ${item.id} was not found in view.`
      );
      return viewModelWasUpdated;
    }

    const itemElement = listElement.children[indexInView] as HTMLElement;

    const groupsBefore = listViewModel.slice(0, indexInView).filter(id => {
      const itm = itemsMap.get(id);

      return itm.childrenCount > 0 && (itm.parentCount || 0) < item.parentCount;
    }).length;

    console.log('item', item.id, 'has', groupsBefore, 'groups before it');

    const elOffset = itemElement.offsetTop;
    const scrollTop = listElement.scrollTop;

    console.log(
      `index: ${indexInView},
      elOffset: ${elOffset},
      scrollTop: ${scrollTop},
      groupsBefore: ${groupsBefore},
      parentCount: ${item.parentCount},
      group offset: ${groupsBefore * 44},
      new scrollTop: ${elOffset - groupsBefore * LIST_EL_HEIGHT},
      new scrolltop by parents count: ${elOffset -
        (item.parentCount - 1) * LIST_EL_HEIGHT}',
      `
    );

    // listElement.scrollTop =
    //   itemElement.offsetTop - groupsBefore * LIST_EL_HEIGHT;

    listElement.scrollTop =
      itemElement.offsetTop - (item.parentCount - 1) * LIST_EL_HEIGHT;

    return viewModelWasUpdated;
  }

  public getItemViewContext(
    id: itemID,
    index: number,
    config: {
      itemsMap: TreeListItemMap;
      listViewModel: itemID[];
    }
  ): TreeListItemViewContext {
    const { itemsMap, listViewModel } = config;
    const item = itemsMap.get(id);

    const nextItem = itemsMap.get(listViewModel[index + 1]);
    return {
      index,
      item,
      groupSelected: this.isGroupSelected(item, itemsMap),
      nextInViewIsGroup: Boolean(nextItem && nextItem.childrenCount),
    };
  }

  private isGroupSelected(
    item: TreeListItem,
    itemsMap: TreeListItemMap
  ): boolean {
    return item.parentIDs.some(groupID => itemsMap.get(groupID).selected);
  }
}
