import { Injectable } from '@angular/core';
import { RtePlaceholder } from './rte.interface';
import { find } from 'lodash';

@Injectable()
export class PlaceholdersConverterService {
  constructor() {}

  padChar = '\xa0';

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
    return elm.innerHTML;
  }

  public toRte(
    contentToConvert: string,
    placeholders: RtePlaceholder[]
  ): string {
    const regex: RegExp = /{{(.*?)}}/gm;
    return contentToConvert && placeholders
      ? contentToConvert.replace(
          regex,
          (field: string, innerContent: string) => {
            const category = this.getGroupDisplayName(
              placeholders,
              innerContent
            );
            const name = this.getDisplayNameById(placeholders, innerContent);

            return (
              // prettier-ignore
              // tslint:disable-next-line: max-line-length
              `<span class="brte-plchldr fr-deletable"><span contenteditable="false" class="fr-deletable" data-placeholder-id="${innerContent}"><i>{{&nbsp;</i>${(category ? '<b>' + category + '&nbsp;&nbsp;</b><i>:&nbsp;&nbsp;</i>' : '') + name}<i>&nbsp;}}</i></span>&nbsp;</span>`
            );
          }
        )
      : contentToConvert
      ? contentToConvert
      : '';
  }

  public toRtePartial = (placeholders: RtePlaceholder[]) => (
    contentToConvert: string
  ) => this.toRte(contentToConvert, placeholders)

  public getDisplayNameById(
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
    return placeholder &&
      placeholder.category &&
      placeholder.category !== 'undefined'
      ? placeholder.category
      : '';
  }

  public getPlaceholderText = (name: string, category: string): string =>
    '{{' + +'}}'
}
