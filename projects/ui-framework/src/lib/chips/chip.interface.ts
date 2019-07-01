import { ChipType } from './chip.enum';

export interface Chip {
  text: string;
  id?: string | number;
  type?: ChipType;
  color?: string;
  avatar?: string;
  removable?: boolean;
  selectable?: boolean;
  disabled?: boolean;
  selected?: boolean;
}
