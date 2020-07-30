import { Styles, TextProps } from '../../services/html/html-helpers.interface';

export type ReadMoreClickEvent = 'text' | 'read-more';

export interface ReadMoreConfig {
  maxLines?: number;
  maxHeight?: number;
  linesThreshold?: number;
  expandable?: boolean;
  showReadMoreButton?: boolean;
  readMoreButtonCss?: Styles;
  watchClicks?: 'text' | 'read-more' | boolean;
  expectChanges?: boolean;
  trustCssVars?: boolean;
  dynamicFontSize?: boolean;
  animateExpand?: boolean;
}

export const READ_MORE_CONFIG_DEF: ReadMoreConfig = {
  maxLines: 10,
  maxHeight: null,
  linesThreshold: 3,
  expandable: true,
  watchClicks: false,
  expectChanges: false,
  trustCssVars: true,
  dynamicFontSize: false,
  animateExpand: true,
  showReadMoreButton: true,
  readMoreButtonCss: null,
};

export interface ReadMoreState {
  maxHeight?: number;
  textElement?: HTMLElement;
  textProps?: TextProps;
  textElementCss?: { marginTop: number };
  enabled?: boolean;
  expanded?: boolean;
  needsReadMoreButton?: boolean;
}
