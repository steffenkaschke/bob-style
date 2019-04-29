import { BlotType } from './rte.enum';

export interface UpdateRteConfig {
  replaceStr: string;
  startIndex: number;
  insertText: string;
  format: UpdateRteConfigFormat;
}

interface RteLinkValue {
  text: string;
  url: string;
  index: number;
}

interface UpdateRteConfigFormat {
  type: BlotType;
  value: RteLinkValue;
}

export interface RteLink {
  text: string;
  url: string;
}

export interface RteCurrentContent {
  body: string;
  plainText: string;
}
