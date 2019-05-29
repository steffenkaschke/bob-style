import { ChipType } from './chips.enum';

export interface Chip {
  type: ChipType;
  color?: string;
  text?: string;
  removable?: boolean;
}
