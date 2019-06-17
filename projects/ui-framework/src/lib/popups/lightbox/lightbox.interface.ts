import { RenderedComponent } from '../../services/component-renderer/component-renderer.interface';

export interface LightboxConfig {
  render?: RenderedComponent;
  image?: string;
  video?: string;
}
