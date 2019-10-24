import { Injectable } from '@angular/core';
import { LinkifyPipe } from '../filters/linkify.pipe';
import { GenericObject } from '../../types';
import { isString, isObject } from '../utils/functional-utils';

@Injectable({ providedIn: 'root' })
export class HtmlParserHelpers {
  constructor() {}

  linkify(value: string, add = ''): string {
    return LinkifyPipe.prototype.transform(value, add);
  }

  cleanupHtml(value: string): string {
    return (
      this.enforceAttributes(value, 'span,p,div,a', {
        contenteditable: null,
        tabindex: null,
        spellcheck: null
      })

        // removing misc froala stuff
        // .replace(/(noopener noreferrer\s?){2,100}/gim, '$1')
        // .replace(/\s?spellcheck="false"/gim, '')
        // .replace(/\s?tabindex="-1"/gim, '')
        // .replace(/contenteditable="false"/gim, '')
        // .replace(/\s?fr-deletable/gi, '')
        // .replace(/\s?class="\s*"/gim, '')

        // replace P with DIV
        .replace(/(<p)/gim, '<div')
        .replace(/<\/p>/gim, '</div>')

        // too many empty lines
        .replace(/(<div([^\n\r\/<>]+)?>\s*<br>\s*<\/div>\s*){2,100}/gim, '$1')

        // empty lines in the end
        .replace(/(<div([^\n\r\/<>]+)?>\s*<br>\s*<\/div>\s*)+$/gi, '')

        // empty tags
        .replace(/<([^\/>\s]+)[^>]*>\s*<\/\1>/gim, '')

        // spaces
        .replace(/&nbsp;/gi, ' ')
        .replace(/\s\s+/g, ' ')
        .trim()
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
            if (isObject(classes)) {
              Object.keys(classes).forEach(c => {
                if (classes[c]) {
                  elem.classList.add(c);
                } else {
                  elem.classList.remove(c);
                }
              });
              return;
            }
            if (isString(classes)) {
              classes = classes.split(' ').filter(c => !!c);
            }
            elem.classList.add(...classes);
          } else {
            if (attributes[attr] !== null) {
              elem.setAttribute(attr, attributes[attr]);
            } else {
              elem.removeAttribute(attr);
            }
          }
        });
      }
    );

    return elm.innerHTML;
  }
}
