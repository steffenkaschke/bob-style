export interface Styles {
  [key: string]: string | number;
}

export interface TextProps {
  [key: string]: number;
}

export interface NotEmptyChildren {
  total: number;
  firstIndex: number | null;
}
