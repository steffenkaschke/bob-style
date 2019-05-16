import { Injectable } from '@angular/core';
import { find } from 'lodash';
import { RtePlaceholder } from './placeholder-rte-converter.interface';
import { getPlaceholderText } from './placeholder-blot';

@Injectable()
export class PlaceholderRteConverterService {
  constructor() {}

  static fromRte(rteInnerHtml: string): string {
    const elm: HTMLElement = document.createElement('div');
    elm.innerHTML = rteInnerHtml + '';
    Array.from(elm.querySelectorAll('[data-placeholder-id]')).forEach(
      existingElement => {
        const placeholderId = existingElement.getAttribute(
          'data-placeholder-id'
        );
        const placeholderTextElement: Text = document.createTextNode(
          '{{' + placeholderId + '}}'
        );
        existingElement.parentNode.replaceChild(
          placeholderTextElement,
          existingElement
        );
      }
    );
    return elm.innerHTML;
  }

  static toRte(
    contentToConvert: string,
    placeholders: RtePlaceholder[]
  ): string {
    const regex: RegExp = /{{(.*?)}}/gm;
    return contentToConvert.replace(
      regex,
      (field: string, innerContent: string) => {
        const category = this.getGroupDisplayName(placeholders, innerContent);
        const name = this.getDisplayNameById(placeholders, innerContent);
        const text = getPlaceholderText(name, category);
        return `<span data-placeholder-id="${innerContent}" data-placeholder-category="${category}">${text}</span>`;
      }
    );
  }

  static toRtePartial = (placeholders: RtePlaceholder[]) => (
    contentToConvert: string
  ) => PlaceholderRteConverterService.toRte(contentToConvert, placeholders)

  static getDisplayNameById(
    placeholders: RtePlaceholder[],
    id: string
  ): string {
    const placeholder = find(placeholders, p => p.id === id);
    return placeholder ? placeholder.displayName : id;
  }

  static getGroupDisplayName(
    placeholders: RtePlaceholder[],
    id: string
  ): string {
    const placeholder = find(placeholders, p => p.id === id);
    return placeholder.category && placeholder.category !== 'undefined'
      ? placeholder.category
      : '';
  }
}
