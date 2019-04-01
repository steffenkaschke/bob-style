import { Type } from '@angular/core';

type cardTableAllowedTextCssProps =
  'color'
  | 'fontSize'
  | 'fontWeight';

type cardTableAllowedCellCssProps =
  'maxWidth'
  | 'alignItems'
  | 'color'
  | 'fontSize'
  | 'fontWeight';

export interface CardTableCellComponentHandlersObj {
  [key: string]: (...args: any[]) => void;
}

export type cardTableAllowedTextStyleObj = {
  [key in cardTableAllowedCellCssProps]?: string
};

export type cardTableAllowedCellStyleObj = {
  [key in cardTableAllowedTextCssProps]?: string
};

export interface CardTableCellComponent {
  component: Type<any>;
  attributes?: object;
  content?: string | string[];
  handlers?: CardTableCellComponentHandlersObj;
}

export interface CardTableCellMeta {
  id?: string | number;
  name: string;
  width?: number;
  align?: string;
  textStyle?: cardTableAllowedTextStyleObj;
  sortablle: boolean;
}

export interface CardTableCellData {
  data: string | string[] | CardTableCellComponent;
}

export interface CardTableMetaData extends Array<CardTableCellMeta> {}

export interface CardTableRowData extends Array<CardTableCellData> {}

export interface CardTableData extends Array<CardTableRowData> {}
