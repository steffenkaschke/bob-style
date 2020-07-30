export interface Styles {
  [key: string]: string | number;
}

export interface TextProps {
  fontSize: number;
  lineHeight: number;
  lineHeightPx?: number;
  [key: string]: number;
}

export interface NotEmptyChildren {
  total: number;
  firstIndex: number | null;
}

export interface NgClass {
  [key: string]: boolean;
}
