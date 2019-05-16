import { BlotType } from './rte.enum';
import { TextBlot } from 'quill/blots/text';

export interface UpdateRteConfig {
  replaceStr: string;
  startIndex: number;
  insertText: string;
  format: UpdateRteConfigFormat;
  unformat?: string[];
  addSpaces?: boolean;
  noLinebreakAfter?: BlotType[];
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
  blot?: TextBlot;
  element?: HTMLElement;
  link?: string;
}

export interface SpecialBlots {
  treatAsWhole?: BlotType[];
  treatAsWholeDefs: BlotType[];
  deleteAsWhole?: BlotType[];
  deleteAsWholeDefs: BlotType[];
  noLinebreakAfter?: BlotType[];
  noLinebreakAfterDefs: BlotType[];
}
