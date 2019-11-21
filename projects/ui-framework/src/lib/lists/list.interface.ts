export interface ListHeader {
  groupName: string;
  key?: string | number;
  isCollapsed: boolean;
  placeHolderSize: number;
  selected: boolean;
  indeterminate?: boolean;
  selectedCount?: number;
}

export interface ListOption {
  isPlaceHolder: boolean;
  groupName: string;
  key?: string | number;
  value: string;
  id: number | string;
  selected: boolean;
  prefixComponent?: ListComponentPrefix;
  disabled?: boolean;
}

export interface SelectGroupOption {
  groupName: string;
  key?: string | number;
  options: SelectOption[];
}

export interface SelectOption {
  value: string;
  id: number | string;
  selected?: boolean;
  prefixComponent?: ListComponentPrefix;
  disabled?: boolean;
}

export interface ListComponentPrefix {
  component: any;
  attributes: any;
}

export interface ListFooterActions {
  apply?: boolean | string;
  clear?: boolean | string;
  reset?: boolean | string;
  cancel?: boolean | string;
}

export interface ActionsButtonState {
  disabled?: boolean;
  hidden?: boolean;
}

export interface ListFooterActionsState {
  apply?: ActionsButtonState;
  clear?: ActionsButtonState;
  reset?: ActionsButtonState;
  cancel?: ActionsButtonState;
}