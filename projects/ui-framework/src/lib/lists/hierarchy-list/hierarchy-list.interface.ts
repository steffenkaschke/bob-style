import { SafeHtml } from '@angular/platform-browser';

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

export interface HierarchyListValue {
  selectedIDs: itemID[];
  selectedValues: string[];
}

export interface HierarchyListItem {
  id: itemID;
  name: string;
  value?: string;

  // state
  collapsed?: boolean;
  selected?: boolean;
  indeterminate?: boolean;
  focused?: boolean;

  parentIDs?: itemID[] | null; // path
  childrenIDs?: itemID[] | null;

  // stats
  parentCount?: number;
  childrenCount?: number;
  selectedCount?: number;

  tooltipText?: string | SafeHtml;

  [key: string]: any;
}

export type HierarchyListItemMap = Map<itemID, HierarchyListItem>;

// export type HierarchyList = HierarchyListOption[];

export interface HierarchyListOption {
  id: itemID;
  name: string;
  children?: HierarchyListOption[];
  [key: string]: any;
}
