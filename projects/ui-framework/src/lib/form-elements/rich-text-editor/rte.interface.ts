import { BlotType, UtilBlotType } from './rte.enum';
import { Blot } from 'parchment/dist/src/blot/abstract/blot';
import { Delta, RangeStatic } from 'quill';

export interface UpdateRteConfig {
  replaceStr: string;
  startIndex: number;
  insertText: string;
  format: UpdateRteConfigFormat;
  unformat?: string[];
  addSpaces?: boolean;
  noLinebreakAfter?: BlotType[];
}

type RteBlotFormat = { [key in BlotType | UtilBlotType]?: any };

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
  endIndex: number;
  length: number;
  text: string;
  format?: RteBlotFormat;
  node?: Node | HTMLElement;
  blot?: Blot;
  element?: HTMLElement;
  link?: string;
  formatIs?: (f: string) => boolean;
  select?: () => RangeStatic;
  delete?: () => Delta;
}

export interface SpecialBlots {
  treatAsWhole?: BlotType[];
  treatAsWholeDefs: BlotType[];
  deleteAsWhole?: BlotType[];
  deleteAsWholeDefs: BlotType[];
  noLinebreakAfter?: BlotType[];
  noLinebreakAfterDefs: BlotType[];
}
