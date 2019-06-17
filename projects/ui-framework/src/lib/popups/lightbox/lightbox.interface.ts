import { RenderedComponent } from '../../services/component-renderer/component-renderer.interface';

export interface LightboxConfig {
  component?: RenderedComponent;
  image?: string;
  url?: string;
  fillScreen?: boolean;
}
