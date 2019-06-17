import { LightboxConfig } from './lightbox.interface';
import { LightboxType } from './lightbox.enum';

export const ALERT_CONFIG_MOCK: LightboxConfig = {
  lightboxType: LightboxType.success,
  text: 'text',
  title: 'title'
};

export const OVERLAY_CONFIG_MOCK = {
  disposeOnNavigation: true,
  hasBackdrop: false,
  panelClass: 'b-lightbox-panel',
  positionStrategy: 'strategy'
};
