import { ChipType } from './chips.enum';

export interface Chip {
  type: ChipType;
  color?: string;
  text?: string;
  removable?: boolean;
}

export interface ChipInputChange {
  value: string[];
  added?: string;
  removed?: string;
}
