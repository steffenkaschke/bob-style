import { Injectable } from '@angular/core';
import {
  CdkOverlayOrigin,
  ConnectedOverlayPositionChange,
  FlexibleConnectedPositionStrategy,
  Overlay,
  PositionStrategy,
  ScrollStrategy,
  ScrollStrategyOptions
} from '@angular/cdk/overlay';
import {
  ABOVE_CENTER,
  ABOVE_END,
  ABOVE_START,
  BELOW_CENTER,
  BELOW_END,
  BELOW_START
} from './panel-position.const';
import { ConnectedPosition } from '@angular/cdk/typings/overlay';
import { PanelDefaultPosVer } from '../panel.enum';
import { OverlayPositionClasses } from '../../../types';
import { isArray } from '../../../services/utils/functional-utils';

@Injectable()
export class PanelPositionService {
  constructor(
    private overlay: Overlay,
    private readonly scrollStrategyOptions: ScrollStrategyOptions
  ) {}

  getPanelPositionStrategy(
    overlayOrigin: CdkOverlayOrigin,
    panelDefaultPosVer: PanelDefaultPosVer | ConnectedPosition[]
  ): FlexibleConnectedPositionStrategy {
    const panelPosition: ConnectedPosition[] = isArray(panelDefaultPosVer)
      ? (panelDefaultPosVer as ConnectedPosition[])
      : panelDefaultPosVer === PanelDefaultPosVer.below
      ? [
          BELOW_CENTER,
          BELOW_START,
          BELOW_END,
          ABOVE_CENTER,
          ABOVE_START,
          ABOVE_END
        ]
      : panelDefaultPosVer === PanelDefaultPosVer.above
      ? [
          ABOVE_CENTER,
          ABOVE_START,
          ABOVE_END,
          BELOW_CENTER,
          BELOW_START,
          BELOW_END
        ]
      : [BELOW_CENTER, ABOVE_CENTER];

    return this.overlay
      .position()
      .flexibleConnectedTo(overlayOrigin.elementRef)
      .withPush()
      .withPositions(panelPosition);
  }

  getCenterPanelPositionStrategy(
    overlayOrigin: CdkOverlayOrigin
  ): PositionStrategy {
    return this.getPanelPositionStrategy(overlayOrigin, [
      BELOW_CENTER,
      ABOVE_CENTER
    ]);
  }

  getPositionClassList(
    change: ConnectedOverlayPositionChange
  ): OverlayPositionClasses {
    return {
      'panel-below': change.connectionPair.overlayY === 'top',
      'panel-above': change.connectionPair.overlayY === 'bottom',
      'panel-after': change.connectionPair.overlayX === 'start',
      'panel-before': change.connectionPair.overlayX === 'end'
    };
  }

  getScrollStrategy(): ScrollStrategy {
    return this.scrollStrategyOptions.reposition();
  }
}
