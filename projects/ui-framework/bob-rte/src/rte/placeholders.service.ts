import { Injectable } from '@angular/core';
import { find } from 'lodash';
import { SelectGroupOption, isNotEmptyArray, SelectOption } from 'bob-style';

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

  public toRte(value: string, placeholders: SelectGroupOption[]): string {
    const regex: RegExp = /{{(.*?)}}/gm;
    return value && isNotEmptyArray(placeholders)
      ? value.replace(regex, (field: string, id: string) => {
          const group = this.getGroupName(placeholders, id);
          const name = this.getOptionName(placeholders, id);

          return (
            // prettier-ignore
            // tslint:disable-next-line: max-line-length
            `<span contenteditable="false" class="brte-plchldr fr-deletable" data-placeholder-id="${id}"><em>{{&nbsp;</em>${(group ? '<strong>' + group + '</strong><em>&nbsp;-&nbsp;</em>' : '') + name}<em>&nbsp;}}</em></span>`
          );
        })
      : value
      ? value
      : '';
  }

  public getGroupName(placeholders: SelectGroupOption[], id: string): string {
    const groupId = id.split('/').filter(i => !!i)[0];
    const group = placeholders.find(g => g.key === groupId);
    return group.groupName;
  }

  public getOptionName(placeholders: SelectGroupOption[], id: string): string {
    let allOptions: SelectOption[] = placeholders.map(g => g.options) as any;
    allOptions = allOptions.concat(...allOptions);
    const option = allOptions.find(o => o.id === id);
    return option.value;
  }
}
