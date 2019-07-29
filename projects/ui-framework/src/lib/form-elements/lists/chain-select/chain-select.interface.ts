import {
  RenderedComponent
} from '../../../services/component-renderer/component-renderer.interface';

export interface ChainLink {
  selectComponentConfig: RenderedComponent;
  active: boolean;
}

export interface SelectComponentConfig {
  outputKey: string;
  selectedIdKey?: string;
}
