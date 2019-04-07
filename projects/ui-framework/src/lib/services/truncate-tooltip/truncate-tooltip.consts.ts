import { Styles } from './truncate-tooltip.interface';

export const commonCSS: Styles = {
  border: '0',
  padding: '0',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

export const truncateCSS: Styles = {
  ...commonCSS,
  display: 'block',
  whiteSpace: 'nowrap'
};

export const lineClampCSS: Styles = {
  ...commonCSS,
  display: '-webkit-box',
  webkitBoxOrient: 'vertical'
};
