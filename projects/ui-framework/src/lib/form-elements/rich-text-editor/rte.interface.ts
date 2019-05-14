import { BlotType } from './rte.enum';

export interface UpdateRteConfig {
  replaceStr: string;
  startIndex: number;
  insertText: string;
  format: UpdateRteConfigFormat;
  unformat?: string[];
  addSpaces?: boolean;
}

type RteBlotFormat = { [key in BlotType]?: any };

interface UpdateRteConfigFormat {
  type: BlotType;
  value: any;
}

export interface RteLink {
  text: string;
  url: string;
}

export interface RteCurrentContent {
  body: string;
  plainText?: string;
}

export interface BlotData {
  index: number;
  length: number;
  text: string;
  format?: RteBlotFormat;
  node?: Node | HTMLElement;
  element?: HTMLElement;
  link?: string;
}
