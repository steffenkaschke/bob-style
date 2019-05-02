import { ChipType } from './chips.enum';

export interface ChipOptions {
  text: string;
  type?: ChipType;
  color?: string;
  [prop: string]: any;
}
