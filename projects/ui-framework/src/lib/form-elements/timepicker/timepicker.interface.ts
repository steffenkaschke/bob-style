import { InputEventType } from '../form-elements.enum';

export interface InputEvent {
  event: InputEventType;
  value: any;
  [key: string]: any;
}
