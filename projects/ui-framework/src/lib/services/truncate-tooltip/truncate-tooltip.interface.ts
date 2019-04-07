export interface Styles {
  [key: string]: string | number;
}

export interface ElementData {
  text?: string;
  fontSize?: number;
  lineHeight?: number;
  tooltipEnabled?: boolean;
  class?: string;
  style?: Styles;
}
