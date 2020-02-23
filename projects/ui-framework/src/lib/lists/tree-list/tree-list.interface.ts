import { SafeHtml } from '@angular/platform-browser';
import { SelectType } from '../list.enum';
import { ListFooterActions } from '../list.interface';
import { EventEmitter } from '@angular/core';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';

export type itemID = string | number;

export interface ViewFilterOptions {
  id?: itemID[];
  search?: string | RegExp;
  searchBy?: 'name' | 'value';
  prop?: { key: string; value: any };
}

export interface ViewFilter {
  show?: ViewFilterOptions;
  hide?: ViewFilterOptions;
}

export interface TreeListValue {
  selectedIDs: itemID[];
  selectedValues: string[];
}

export interface TreeListItem {
  id: itemID;
  name: string;
  value?: string;

  // state
  collapsed?: boolean;
  selected?: boolean;
  indeterminate?: boolean;
  focused?: boolean;
  disabled?: boolean;

  parentIDs?: itemID[] | null; // path
  childrenIDs?: itemID[] | null;

  // stats
  parentCount?: number;
  childrenCount?: number;
  selectedCount?: number;

  // tooltipText?: string | SafeHtml;

  [key: string]: any;
}

export type TreeListItemMap = Map<itemID, TreeListItem>;

export interface GetItemViewContext {
  index: number;
  item: TreeListItem;
  prevItem: TreeListItem;
  nextItem: TreeListItem;
  groupSelected: boolean;
  firstInGroup: boolean;
  lastInGroup: boolean;
}

// export type TreeList = TreeListOption[];

export interface TreeListOption {
  id: itemID;
  name: string;
  children?: TreeListOption[];
  [key: string]: any;
}

export interface TreeListComponentIO {
  list: TreeListOption[];
  value: itemID[];
  viewFilter: ViewFilter;

  type: SelectType;
  valueSeparatorChar: string;
  maxHeightItems: number;
  showSingleGroupHeader: boolean;
  startCollapsed: boolean;
  readonly: boolean;
  disabled: boolean;
  listActions: ListFooterActions;

  embedded?: boolean;
  focusOnInit?: boolean;
  tooltipType?: TruncateTooltipType;
  changed?: EventEmitter<TreeListValue>;
  apply?: EventEmitter<void>;
  cancel?: EventEmitter<void>;
}
