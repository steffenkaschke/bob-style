import { Injectable } from '@angular/core';
import { controlKeys, Keys } from '../../enums';
import {
  isNumber,
  eventHasCntrlKey,
} from '../../services/utils/functional-utils';
import {
  CLOSING_SYMBOLS,
  SMILEY_EMOJI_MAP,
} from '../../popups/emoji/smiley-to-emoji-data.consts';
import { InputEvent } from 'bob-style';

@Injectable({
  providedIn: 'root',
})
export class FormElementKeyboardCntrlService {
  readonly combinations = SMILEY_EMOJI_MAP;
  readonly closingSymbols = CLOSING_SYMBOLS;

  constructor() {}

  public filterAllowedKeys(
    event: KeyboardEvent,
    allowedKeys = /[0-9,\W]/i
  ): KeyboardEvent {
    if (eventHasCntrlKey(event)) {
      return event;
    }

    event.stopPropagation();

    if (
      !allowedKeys.test(event.key) &&
      !controlKeys.includes(event.key as Keys)
    ) {
      event.preventDefault();
      return null;
    }
  }

  public insertNewLineAtCursor(inputEl: HTMLInputElement): string {
    const cursorPos = inputEl.selectionStart;

    if (!isNumber(cursorPos)) {
      return null;
    }

    inputEl.value =
      inputEl.value.substring(0, cursorPos) +
      '\n' +
      inputEl.value.substring(cursorPos);

    inputEl.setSelectionRange(cursorPos + 1, cursorPos + 1);

    return inputEl.value;
  }

  public parseIfSymbol(event: InputEvent, inputEl: HTMLInputElement): void {
    if (this.closingSymbols.test(event.data)) {
      this.setParsedEmoji(inputEl);
    }
  }

  public setParsedEmoji(inputEl: HTMLInputElement): void {
    setTimeout(() => {
      let str = this.reverseParse(inputEl.value);
      const cursorPos = inputEl.selectionStart;
      str = this.parse(str);

      inputEl.value = str;
      inputEl.selectionStart = cursorPos;
      inputEl.selectionEnd = cursorPos;
    }, 0);
  }

  private parse(str: string): string {
    Object.keys(this.combinations).forEach(key => {
      const regex = new RegExp(this.escapeRegExp(key), 'g');
      str = str.replace(regex, this.combinations[key]);
    });
    return str;
  }

  private reverseParse(str: string): string {
    Object.keys(this.combinations).forEach(key => {
      str = str.replace(new RegExp(this.combinations[key], 'g'), key);
    });
    return str;
  }

  private escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
