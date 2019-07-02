import { ChipType } from './chip.enum';

export interface Chip {
  text: string;
  id?: string | number;
  type?: ChipType;
  avatar?: string;
  removable?: boolean;
  selectable?: boolean;
  disabled?: boolean;
  selected?: boolean;
}

export interface ChipListConfig {
  type?: ChipType;
  removable?: boolean;
  selectable?: boolean;
  disabled?: boolean;
}
