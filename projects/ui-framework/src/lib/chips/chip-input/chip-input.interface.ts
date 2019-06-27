import { InputEventType } from '../../form-elements/form-elements.enum';

export interface ChipInputChange {
  value: string[];
  added?: string;
  removed?: string;
  event?: InputEventType;
}
