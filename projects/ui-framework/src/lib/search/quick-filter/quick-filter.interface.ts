import { SelectGroupOption } from '../../form-elements/lists/list.interface';
import { QuickFilterSelectType } from './quick-filter.enum';
import { ListChange } from '../../form-elements/lists/list-change/list-change';

export interface QuickFilterConfig {
  key: string;
  value?: any;
  selectType?: QuickFilterSelectType;
  options?: SelectGroupOption[];
  showSingleGroupHeader?: boolean;
  label?: string;
  placeholder?: string;
  [k: string]: any;
}

export interface QuickFilterChangeEvent {
  key: string;
  listChange: ListChange;
}

export interface QuickFilterBarChangeEvent {
  [key: string]: QuickFilterChangeEvent;
}
