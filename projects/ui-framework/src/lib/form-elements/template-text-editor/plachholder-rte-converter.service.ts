import { Injectable } from '@angular/core';
import { find } from 'lodash';
import { ListOptions } from './plachholder-rte-converter';
@Injectable()
export class PlachholderRteConverterService {
  constructor() {
  }

  public convertContentToRteCompatible(contentToConvert: string, listOptions: ListOptions[]): string {
    const regex: RegExp = /{{(.*?)}}/gm;
    return contentToConvert
      .replace(regex, (field: string, innerContent: string) => {
        // tslint:disable-next-line:max-line-length
        return`<span placeholder="${innerContent}">${this.matchListOptionsToConvertedValue(listOptions, innerContent)}</span>`;
      });
  }

  private matchListOptionsToConvertedValue(listOptions: ListOptions[], nameById: string): string {
    const listOptionValue =  find(listOptions, option => option.id === nameById);
    return listOptionValue.displayName;
  }
}
