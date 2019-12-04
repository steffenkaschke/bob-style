export interface GenericObject {
  [key: string]: any;
}

export interface OverlayPositionClasses {
  'panel-below'?: boolean;
  'panel-above'?: boolean;
  'panel-after'?: boolean;
  'panel-before'?: boolean;
}

export interface DOMInputEvent extends UIEvent {
  readonly data: string | null;
  readonly isComposing: boolean;
  readonly dataTransfer: DataTransfer;
  readonly inputType: string;
  readonly target: HTMLInputElement;
}
