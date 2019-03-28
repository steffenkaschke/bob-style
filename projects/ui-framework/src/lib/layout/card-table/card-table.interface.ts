import { Type } from '@angular/core';

type allowedCssProps =
  | 'max-width'
  | 'maxWidth'
  | 'color'
  | 'font-size'
  | 'fontSize'
  | 'font-weight'
  | 'fontWeight';

export type allowedStyleObj = { [key in allowedCssProps]?: string };

export interface CellComponent {
  component: Type<any>;
  attributes?: object;
  content?: string;
}

export interface CellMeta {
  id?: string | number;
  name: string;
  width?: string | number;
  style?: allowedStyleObj;
  sortablle: boolean;
}

export interface CellData {
  data: string | string[] | CellComponent;
}

export interface RowData extends Array<CellData> {}

export interface MetaData extends Array<CellMeta> {}

export interface CardTableData {
  meta: MetaData;
  rows: RowData[];
}
