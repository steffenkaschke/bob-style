import { Injectable } from '@angular/core';
import { MasonryConfig, MasonryState } from './masonry.interface';
import { isNumber } from '../../services/utils/functional-utils';
import {
  MASONRY_CONFIG_DEF,
  MASONRY_GAP_DEF,
  MASONRY_COLS_DEF,
  MASONRY_ROW_DIVISION,
} from './masonry.const';

@Injectable()
export class MasonryService {
  constructor() {}

  public setElementRowSpan(
    element: HTMLElement,
    config: MasonryConfig,
    hardcore = false
  ): void {
    if (!element) {
      return;
    }
    element.style.removeProperty('grid-row-end');

    let contentHeight = 0;

    if (hardcore && element.children.length === 1) {
      const elStyle = getComputedStyle(element);
      contentHeight =
        (element.children[0] as HTMLElement).scrollHeight +
        (parseFloat(elStyle.paddingTop) +
          parseFloat(elStyle.paddingBottom) +
          parseFloat(elStyle.borderTopWidth) +
          parseFloat(elStyle.borderBottomWidth));
    }

    let rowSpan =
      (Math.max(element.scrollHeight, element.offsetHeight, contentHeight) +
        config.gap) /
      (MASONRY_ROW_DIVISION + config.gap);
    rowSpan = hardcore ? Math.round(rowSpan) : Math.ceil(rowSpan);

    element.style.gridRowEnd = 'span ' + rowSpan;
  }

  public processConfig(config: MasonryConfig): MasonryConfig {
    if (!config) {
      return { ...MASONRY_CONFIG_DEF };
    }

    config.gap = isNumber(config.gap) ? config.gap : MASONRY_GAP_DEF;
    config.columns = isNumber(config.columns)
      ? config.columns || null
      : MASONRY_COLS_DEF;
    config.columnWidth = isNumber(config.columnWidth)
      ? config.columnWidth || null
      : null;

    return config;
  }

  public stateChanged(
    element: HTMLElement,
    config: MasonryConfig,
    state: MasonryState
  ): boolean {
    return Boolean(
      !state ||
        state.config !== config ||
        state.childrenCount !== element.children.length ||
        Math.abs(state.hostWidth - element.offsetWidth) > 20
    );
  }
}
