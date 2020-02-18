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

  parentIDs?: itemID[] | null; // path
  childrenIDs?: itemID[] | null;

  // stats
  parentCount?: number;
  childrenCount?: number;
  selectedCount?: number;

  tooltipText?: string | SafeHtml;

  [key: string]: any;
}

export type TreeListItemMap = Map<itemID, TreeListItem>;

// export type TreeList = TreeListOption[];

export interface TreeListOption {
  id: itemID;
  name: string;
  children?: TreeListOption[];
  [key: string]: any;
}
