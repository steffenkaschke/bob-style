import { Injectable } from '@angular/core';
import { find, get } from 'lodash';
import { Placeholder } from './placeholder-rte-converter';
@Injectable()
export class PlaceholderRteConverterService {
  constructor() {
  }

  public toRte(contentToConvert: string, placeholders: Placeholder[]): string {
    const regex: RegExp = /{{(.*?)}}/gm;
    return contentToConvert
      .replace(regex, (field: string, innerContent: string) => {
        // tslint:disable-next-line:max-line-length
        return`<span placeholder="${innerContent}">${this.matchListOptionsToConvertedValue(placeholders, innerContent)}</span>`;
      });
  }

  private matchListOptionsToConvertedValue(placeholders: Placeholder[], id: string): string {
    const placeholder = find(placeholders, p => p.id === id);
    return placeholder ? placeholder.displayName : id;
  }
}
