import { RenderedComponent } from '../../services/component-renderer/component-renderer.interface';

type cardTableAllowedTextCssProps = 'color' | 'fontSize' | 'fontWeight';

type cardTableAllowedCellCssProps =
  | 'maxWidth'
  | 'alignItems'
  | 'color'
  | 'fontSize'
  | 'fontWeight';

export type cardTableAllowedTextStyleObj = {
  [key in cardTableAllowedCellCssProps]?: string
};

export type cardTableAllowedCellStyleObj = {
  [key in cardTableAllowedTextCssProps]?: string
};

export interface CardTableCellMeta {
  id?: string | number;
  name: string;
  width?: number;
  align?: string;
  textStyle?: cardTableAllowedTextStyleObj;
  sortablle: boolean;
}

export interface CardTableCellData {
  data: string | string[] | RenderedComponent;
}

export interface CardTableMetaData extends Array<CardTableCellMeta> {}

export interface CardTableRowData extends Array<CardTableCellData> {}

export interface CardTableData extends Array<CardTableRowData> {}
