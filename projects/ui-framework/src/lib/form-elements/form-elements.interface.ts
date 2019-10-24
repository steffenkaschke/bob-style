import { InputEventType, FormEvents } from './form-elements.enum';

export interface TransmitOptions {
  eventType: InputEventType[];
  eventName?: FormEvents;
  doPropagate?: boolean;
  addToEventObj?: { [key: string]: any };
  saveValue?: boolean;
}
