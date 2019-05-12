import { Injectable } from '@angular/core';
import { find } from 'lodash';
import { RtePlaceholder } from './placeholder-rte-converter.interface';

@Injectable()
export class PlaceholderRteConverterService {
  constructor() {}

  private padChar = '\xa0';

  public fromRte(rteInnerHtml: string): string {
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
    return elm.innerHTML.toString();
  }

  public toRte(
    contentToConvert: string,
    placeholders: RtePlaceholder[]
  ): string {
    const regex: RegExp = /{{(.*?)}}/gm;
    return contentToConvert.replace(
      regex,
      (field: string, innerContent: string) => {
        const category = this.getGroupDisplayName(placeholders, innerContent);
        const name = this.getDisplayNameById(placeholders, innerContent);
        const text = this.getPlaceholderText(name, category);
        return `<span data-placeholder-id="${innerContent}"
        data-placeholder-category="${this.getCategoryText(
          category,
          2,
          1
        )}">${text}</span>`;
      }
    );
  }

  public toRtePartial = (placeholders: RtePlaceholder[]) => (
    contentToConvert: string
  ) => this.toRte(contentToConvert, placeholders)

  private getCategoryText(
    category: string,
    startSpaces = 0,
    endSpaces = 2
  ): string {
    return category
      ? this.padChar.repeat(startSpaces) +
          category +
          this.padChar.repeat(endSpaces)
      : '';
  }
  public getPlaceholderText(name: string, category: string): string {
    return (
      this.padChar.repeat(2) +
      this.getCategoryText(category, 0, 2) +
      name +
      this.padChar.repeat(2)
    );
  }

  private getDisplayNameById(
    placeholders: RtePlaceholder[],
    id: string
  ): string {
    const placeholder = find(placeholders, p => p.id === id);
    return placeholder ? placeholder.displayName : id;
  }

  public getGroupDisplayName(
    placeholders: RtePlaceholder[],
    id: string
  ): string {
    const placeholder = find(placeholders, p => p.id === id);
    return placeholder.category && placeholder.category !== 'undefined'
      ? placeholder.category
      : '';
  }
}
