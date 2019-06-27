import { ChipType } from './chip.enum';

export interface Chip {
  text?: string;
  type?: ChipType;
  color?: string;
  removable?: boolean;
  selectable?: boolean;
}
