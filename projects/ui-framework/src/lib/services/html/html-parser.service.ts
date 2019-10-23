import { Injectable } from '@angular/core';
import { LinkifyPipe } from '../filters/linkify.pipe';
import { GenericObject } from '../../types';
import { isString } from '../utils/functional-utils';

@Injectable({ providedIn: 'root' })
export class HtmlParserHelpers {
  constructor() {}

  linkify(value: string, add = ''): string {
    return LinkifyPipe.prototype.transform(value, add);
  }

  cleanupHtml(value: string): string {
    return (
      value
        // misc stuff
        .replace(/spellcheck="false"/gim, '')
        .replace(/(noopener noreferrer\s?){2,100}/gim, '$1')
        .replace(/class="fr-deletable"/gim, '')
        // replace P with DIV
        .replace(/(<p)/gim, '<div')
        .replace(/<\/p>/gim, '</div>')
        // // replace EM with I
        // .replace(/(<em)/gim, '<i')
        // .replace(/<\/em>/gim, '</i>')
        // // replace STRONG with B
        // .replace(/(<strong)/gim, '<b')
        // .replace(/<\/strong>/gim, '</b>')
        // too many empty lines
        .replace(
          /(<p([^\n\r\/<>]+)?>\s?<br>\s?<\/p>|<div([^\n\r\/<>]+)?>\s?<br>\s?<\/div>\s?){2,100}/gim,
          '$1'
        )
        // empty tags
        // .replace(/<[^\/>][^>]+>(\s+)?<\/[^>]+>/gi, '')
        // spaces
        .replace(/&nbsp;/gi, ' ')
        .replace(/\s\s+/g, ' ')
    );
  }

  enforceAttributes(
    value: string,
    selector: string,
    attributes: GenericObject = {}
  ): string {
    const elm: HTMLElement = document.createElement('div');
    elm.innerHTML = value;

    Array.from(elm.querySelectorAll(selector)).forEach(
      (elem: HTMLElement): void => {
        Object.keys(attributes).forEach(attr => {
          if (attr === 'class') {
            let classes = attributes[attr];
            if (isString(classes)) {
              classes = classes.split(' ').filter(c => !!c);
            }
            elem.classList.add(...classes);
          } else {
            elem.setAttribute(attr, attributes[attr]);
          }
        });
      }
    );

    return elm.innerHTML;
  }
}
