import { Injectable } from '@angular/core';
import { find } from 'lodash';
import { RtePlaceholder } from './placeholder-rte-converter.interface';

@Injectable()
export class PlaceholderRteConverterService {
  constructor() {}

  public fromRte(rteInnerHtml: string): string {
    const elm: HTMLElement = document.createElement('div');
    elm.innerHTML = rteInnerHtml + '';
    Array.from(elm.querySelectorAll('[data-placeholder-id]')).forEach(existingElement => {
      const placeholderId = existingElement.getAttribute('data-placeholder-id');
      const placeholderTextElement: Text =
        document.createTextNode('{{' + placeholderId + '}}');
      existingElement.parentNode.replaceChild(placeholderTextElement, existingElement);
    });
    return elm.innerHTML.toString();
  }

  public toRte(contentToConvert: string, placeholders: RtePlaceholder[]): string {
    const regex: RegExp = /{{(.*?)}}/gm;
    return contentToConvert
      .replace(regex, (field: string, innerContent: string) => {
        // tslint:disable-next-line:max-line-length
        return`<span data-placeholder-category="${this.getGroupDisplayName(placeholders, innerContent)}" data-placeholder-id="${innerContent}">${this.getDisplayNameById(placeholders, innerContent)}</span>`;
      });
  }

  public toRtePartial =
    (placeholders: RtePlaceholder[]) => (contentToConvert: string) => this.toRte(contentToConvert, placeholders)

  private getDisplayNameById(placeholders: RtePlaceholder[], id: string): string {
    const placeholder = find(placeholders, p => p.id === id);
    return placeholder ? placeholder.displayName : id;
  }

  public getGroupDisplayName(placeholders: RtePlaceholder[], id: string): string {
    const placeholder = find(placeholders, p => p.id === id);
    return placeholder.category;
  }
}
