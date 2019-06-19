import { RenderedComponent } from '../../services/component-renderer/component-renderer.interface';
import { SafeResourceUrl } from '@angular/platform-browser';

export interface LightboxConfig {
  component?: RenderedComponent;
  image?: string;
  video?: string | SafeResourceUrl;
  fillScreen?: boolean;
}

// export interface LightboxConfig {
//   component?: RenderedComponent;
//   image?: string;
//   video?: string | SafeResourceUrl;
//   fillScreen?: boolean;
// }
