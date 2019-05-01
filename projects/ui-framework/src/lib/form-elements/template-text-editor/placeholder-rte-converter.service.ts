import { Injectable } from '@angular/core';
import { find } from 'lodash';
import { Placeholder } from './placeholder-rte-converter';

@Injectable()
export class PlaceholderRteConverterService {
  constructor() {
  }

  public fromRte(rteInnerHtml: string, placeholders: Placeholder[]): string {
    const elm: HTMLElement = document.createElement('div');
    elm.innerHTML = rteInnerHtml + '';
    Array.from(elm.querySelectorAll('[placeholder]')).forEach(e => {
      const b: Text =
        document.createTextNode('{{' +
          this.matchPlaceholderToConvertedValueBtDisplyName(placeholders, e.innerHTML)
          + '}}');
      e.parentNode.replaceChild(b, e);
    });
    return elm.innerHTML.toString();
  }

  public toRte(contentToConvert: string, placeholders: Placeholder[]): string {
    const regex: RegExp = /{{(.*?)}}/gm;
    return contentToConvert
      .replace(regex, (field: string, innerContent: string) => {
        // tslint:disable-next-line:max-line-length
        return`<span placeholder="${innerContent}">${this.matchPlaceholderToConvertedValueBtId(placeholders, innerContent)}</span>`;
      });
  }

  private matchPlaceholderToConvertedValueBtId(placeholders: Placeholder[], id: string): string {
    const placeholder = find(placeholders, p => p.id === id);
    return placeholder ? placeholder.displayName : id;
  }

  private matchPlaceholderToConvertedValueBtDisplyName(placeholders: Placeholder[], displayName: string): string {
    const placeholder = find(placeholders, p => p.displayName === displayName);
    return placeholder ? placeholder.id : displayName;
  }
}
