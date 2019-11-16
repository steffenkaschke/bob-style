import { SelectGroupOption } from '../../form-elements/lists/list.interface';
import { QuickFilterSelectType } from './quick-filter.enum';
import { ListChange } from '../../form-elements/lists/list-change/list-change';
import { FormEvents } from '../../form-elements/form-elements.enum';

export interface QuickFilterConfig {
  key: string;
  value?: any;
  options?: SelectGroupOption[];
  selectType?: QuickFilterSelectType;
  label?: string;
  placeholder?: string;
  showSingleGroupHeader?: boolean;
  [k: string]: any;
}

export interface QuickFilterChangeEvent {
  key: string;
  listChange: ListChange;
}

export interface QuickFilterBarChangeEvent {
  [key: string]: QuickFilterChangeEvent;
}
