import { ChipType } from './chip.enum';

export interface Chip {
  type: ChipType;
  color?: string;
  text?: string;
  removable?: boolean;
}
