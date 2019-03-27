import { Type } from '@angular/core';

export interface CellMeta {
  id?: string | number;
  name: string;
  width?: string;
  sortablle: boolean;
}

export interface CellData {
  data: string | string[] | Type<any>;
}

export interface RowData extends Array<CellData> {}

export interface MetaData extends Array<CellMeta> {}

export interface CardTableData {
  meta: MetaData;
  rows: RowData[];
}
