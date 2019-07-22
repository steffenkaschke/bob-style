import {
  RenderedComponent
} from '../../../services/component-renderer/component-renderer.interface';
import { ListChange } from '../list-change/list-change';

export interface ChainLink {
  selectComponentConfig: RenderedComponent;
  active: boolean;
}

export interface ChainListChange {
  listChange: ListChange;
  index: number;
}
