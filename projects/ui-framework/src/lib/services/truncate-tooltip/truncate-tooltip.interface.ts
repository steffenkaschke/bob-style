export interface Styles {
  [key: string]: string | number;
}

export interface ElementData {
  text?: string;
  fontSize?: number;
  lineHeight?: number;
  contentWidth?: number;
  contentHeight?: number;
  scrollWidth?: number;
  scrollHeight?: number;
  tooltipEnabled?: boolean;
  style?: Styles;
}
