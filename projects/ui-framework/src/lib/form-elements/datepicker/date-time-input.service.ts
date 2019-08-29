import { Injectable } from '@angular/core';
import { controlKeys, Keys } from '../../enums';

@Injectable()
export class DateTimeInputService {
  public filterAllowedKeys(
    event: KeyboardEvent,
    allowedKeys = /[0-9,\W]/i
  ): KeyboardEvent {
    if (!event.metaKey) {
      event.stopPropagation();

      if (
        !allowedKeys.test(event.key) &&
        !controlKeys.includes(event.key as Keys)
      ) {
        event.preventDefault();
        return null;
      }

      return event;
    }
  }

  public convertSeparators(value: string, useChar = '/') {
    return value.replace(/\W+/g, useChar);
  }
}
