import { BlotType } from './rte.enum';

export interface UpdateRteConfig {
  replaceStr: string;
  startIndex: number;
  insertText: string;
  format: UpdateRteConfigFormat;
}

interface UpdateRteConfigFormat {
  type: BlotType;
  value: any;
}

export interface RteLink {
  text: string;
  url: string;
  index?: number;
}

export interface RteCurrentContent {
  body: string;
  plainText: string;
}
