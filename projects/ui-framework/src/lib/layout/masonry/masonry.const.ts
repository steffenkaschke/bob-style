import { MasonryConfig } from './masonry.interface';

export const MASONRY_GAP_DEF = 16;
export const MASONRY_COLS_DEF = 3;
export const MASONRY_ROW_DIVISION = 1;

export const MASONRY_CONFIG_DEF: MasonryConfig = {
  columns: MASONRY_COLS_DEF,
  gap: MASONRY_GAP_DEF,
};

export const MASONRY_OBSERVER_CONFIG = {
  childList: true,
  subtree: true,
  characterData: true,
  attributeFilter: ['src', 'data-loaded', 'data-updated'],
};
