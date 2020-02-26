import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone,
  ElementRef,
} from '@angular/core';
import { itemID, TreeListItem } from './tree-list.interface';
import { TreeListModelService } from './services/tree-list-model.service';
import { SelectType } from '../list.enum';
import {
  joinArrays,
  stringify,
  isBoolean,
  isNotEmptyArray,
} from '../../services/utils/functional-utils';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { BaseTreeListElement } from './tree-list.abstract';
import { TreeListControlsService } from './services/tree-list-controls.service';
import { selectValueOrFail } from '../../services/utils/transformers';
import { TreeListViewService } from './services/tree-list-view.service';

@Component({
  selector: 'b-tree-list',
  templateUrl: './tree-list.component.html',
  styleUrls: ['./tree-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeListComponent extends BaseTreeListElement {
  constructor(
    modelSrvc: TreeListModelService,
    cntrlsSrvc: TreeListControlsService,
    viewSrvc: TreeListViewService,
    DOM: DOMhelpers,
    cd: ChangeDetectorRef,
    zone: NgZone,
    host: ElementRef
  ) {
    super(modelSrvc, cntrlsSrvc, viewSrvc, DOM, cd, zone, host);
  }

  protected updateListViewModel(expand = false): void {
    console.time('updateListViewModel');
    this.listViewModel.length = 0;

    this.listViewModel.push(
      ...this.modelSrvc.getListViewModel(this.list, this.itemsMap, {
        viewFilter: this.viewFilter,
        expand,
        keyMap: this.keyMap,
      })
    );

    console.log('===> updateListViewModel');

    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
    console.timeEnd('updateListViewModel');
  }

  protected itemClick(item: TreeListItem, element: HTMLElement): void {
    if (
      item.childrenCount &&
      !item.allOptionsHidden &&
      this.type !== SelectType.single
    ) {
      this.toggleItemCollapsed(item, element);
      return;
    }
    if (
      !item.childrenCount ||
      item.allOptionsHidden ||
      this.type === SelectType.single
    ) {
      this.toggleItemSelect(item);
    }
  }

  protected toggleItemCollapsed(
    item: TreeListItem,
    element: HTMLElement
  ): void {
    let elOffset: number;

    if (!item.collapsed) {
      elOffset = element.offsetTop;
    }

    item.collapsed = !item.collapsed;

    if (item.collapsed) {
      this.cd.detectChanges();
      this.listElement.nativeElement.scrollTop =
        this.listElement.nativeElement.scrollTop -
        (elOffset - element.offsetTop);
    }

    this.updateListViewModel();
  }

  protected toggleItemSelect(
    item: TreeListItem,
    force: boolean = null,
    set: Partial<TreeListItem> = {}
  ): void {
    const newSelectedValue = isBoolean(force) ? force : !item.selected;
    if (newSelectedValue === item.selected) {
      return;
    }
    item.selected = newSelectedValue;

    if (this.type === SelectType.single) {
      if (item.selected) {
        console.log('single select');

        if (this.value && this.value[0] && this.value[0] !== item.id) {
          console.log('deselecting', this.value[0]);
          this.itemsMap.get(this.value[0]).selected = false;
        }
        this.value = [item.id];
      } else {
        this.value = [];
      }

      this.emitChange();
    }

    // this.cd.detectChanges();

    if (this.type !== SelectType.multi) {
      return;
    }

    item.selected = newSelectedValue;

    // if group

    if (item.childrenCount) {
      if (item.selected && item.selectedCount) {
        item.selectedIDs.forEach(id => {
          this.toggleItemSelect(this.itemsMap.get(id), false, {
            parentSelected: true,
          });
        });
      }
    }

    // update parent counters

    item.parentIDs.forEach(groupID => {
      const parent = this.itemsMap.get(groupID);
      parent.selectedCount = Math.max(
        0,
        (parent.selectedCount || 0) + (item.selected ? 1 : -1)
      );

      if (item.selected) {
        parent.selectedIDs.push(item.id);
      } else {
        parent.selectedIDs = parent.selectedIDs.filter(id => id !== item.id);
      }
    });

    // if option

    if (!item.childrenCount) {
      if (item.selected) {
        this.value.push(item.id);
      } else {
        this.value = this.value.filter(id => id !== item.id);
      }
    }

    // item.selected = !item.selected;

    // for (const groupID of item.parentIDs) {
    //   const parent = this.itemsMap.get(groupID);
    //   parent.selectedCount = parent.selectedCount + (item.selected ? 1 : -1);

    //   parent.selected = parent.selectedCount === parent.childrenCount;

    //   parent.indeterminate = !parent.selected && !!parent.selectedCount;
    // }

    this.updateActionButtonsState();
    this.cd.detectChanges();
    this.emitChange();
  }

  // returns true if listViewModel was updated
  protected applyValue(newValue: itemID[]): boolean {
    console.time('applyValue');
    let affectedIDs: itemID[] = this.value || [];
    this.value = selectValueOrFail(newValue);
    if (this.value && this.type === SelectType.single) {
      this.value = this.value.slice(0, 1);
    }
    let viewModelWasUpdated = false;
    console.log('<=== applyValue:', this.value);

    if (!this.itemsMap.size) {
      return viewModelWasUpdated;
    }
    affectedIDs = joinArrays(affectedIDs, this.value || []);

    let firstSelectedID: itemID;

    affectedIDs.forEach(id => {
      const item = this.itemsMap.get(id);

      if (!item) {
        console.error(
          `[TreeListComponent.applyValue]:
          No item data for ID: "${stringify(id)}". Removing ID from value.`
        );
        this.value = this.value.filter(valId => valId !== id);
        return;
      }

      item.selected = !!newValue && this.value.includes(item.id);
      if (!firstSelectedID && item.selected) {
        firstSelectedID = item.id;
      }
    });

    if (firstSelectedID) {
      const item = this.itemsMap.get(firstSelectedID);

      this.viewSrvc.expandAllSelected(this.value, this.itemsMap);
      this.updateListViewModel();
      viewModelWasUpdated = true;

      viewModelWasUpdated =
        this.viewSrvc.scrollToItem(item, {
          listViewModel: this.listViewModel,
          listElement: this.listElement.nativeElement,
          itemsMap: this.itemsMap,
          updateListViewModel: this.updateListViewModel.bind(this),
        }) || viewModelWasUpdated;
    } else {
      this.toggleCollapseAll(this.startCollapsed);
      this.listElement.nativeElement.scrollTop = 0;
      viewModelWasUpdated = true;
    }

    console.timeEnd('applyValue');
    return viewModelWasUpdated;
  }

  protected emitChange(): void {
    if (this.type === SelectType.single) {
      this.changed.emit({
        selectedIDs: this.value || [],
        selectedValues:
          this.value && this.value[0]
            ? [this.itemsMap.get(this.value[0]).value]
            : [],
      });

      return;
    }

    if (this.type === SelectType.multi) {
      if (isNotEmptyArray(this.value)) {
        this.value = this.modelSrvc.sortIDlistByItemIndex(
          this.itemsMap,
          this.value
        );
      }
      this.changed.emit({
        selectedIDs: this.value || [],
        selectedValues: isNotEmptyArray(this.value)
          ? this.value.map(id => this.itemsMap.get(id).value)
          : [],
      });
    }

    this.listActionsState.apply.disabled = false;
  }
}
