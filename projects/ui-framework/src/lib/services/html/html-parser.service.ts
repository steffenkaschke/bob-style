import { Injectable } from '@angular/core';
import { LinkifyPipe } from '../filters/linkify.pipe';
import { GenericObject } from '../../types';
import { isString, isObject } from '../utils/functional-utils';

@Injectable({ providedIn: 'root' })
export class HtmlParserHelpers {
  constructor() {}

  public linkify(value: string, add = ''): string {
    return LinkifyPipe.prototype.transform(value, add);
  }

  public cleanupHtml(
    value: string,
    enforcedAttrs: GenericObject = {
      contenteditable: null,
      tabindex: null,
      spellcheck: null,
      class: {
        'brte-*': false,
        'fr-*': false
      }
    }
  ): string {
    return (
      this.enforceAttributes(value, 'span,p,div,a', enforcedAttrs)

        // removing misc froala stuff
        .replace(/(noopener noreferrer\s?){2,100}/gim, '$1')
        // .replace(/\s?class="\s*"/gim, '')

        // replace P with DIV
        .replace(/(<p)/gim, '<div')
        .replace(/<\/p>/gim, '</div>')

        // empty tags
        .replace(/<([^\/>\s]+)[^>]*>\s*<\/\1>/gim, '')

        // spaces
        .replace(/&nbsp;/gi, ' ')
        .replace(/\s\s+/g, ' ')

        // too many empty lines
        .replace(/(<div([^\n\r\/<>]+)?>\s*<br>\s*<\/div>\s*){2,100}/gim, '$1')

        // empty lines in the end
        .replace(/(<div([^\n\r\/<>]+)?>\s*<br>\s*<\/div>\s*)+$/gi, '')

        // empty lines in the beginning
        .replace(/^(\s*<div([^\n\r\/<>]+)?>\s*<br>\s*<\/div>)+/gi, '')

        .trim()
    );
  }

  public enforceAttributes(
    value: string,
    selector: string,
    attributes: GenericObject = {}
  ): string {
    const elm: HTMLElement = document.createElement('div');
    elm.innerHTML = value;

    Array.from(elm.querySelectorAll(selector)).forEach(
      (elem: HTMLElement): void => {
        Object.keys(attributes).forEach(attr => {
          if (attributes[attr] === null) {
            elem.removeAttribute(attr);
          } else {
            if (attr === 'class') {
              let classes = attributes[attr];
              if (isObject(classes)) {
                Object.keys(classes).forEach(c => {
                  if (classes[c]) {
                    elem.classList.add(c);
                  } else {
                    if (
                      c.endsWith('*') &&
                      c.length > 1 &&
                      elem.className !== ''
                    ) {
                      const srch = new RegExp(
                        `(${c.slice(0, -1)}\\w+\\s*)`,
                        'gi'
                      );
                      elem.className = elem.className.replace(srch, '');
                    } else {
                      elem.classList.remove(c);
                    }
                  }
                });
              } else {
                if (isString(classes)) {
                  classes = classes.split(' ').filter(Boolean);
                }
                elem.classList.add(...classes);
              }
              if (elem.className === '') {
                elem.removeAttribute(attr);
              }
            } else {
              if (attributes[attr] !== null) {
                elem.setAttribute(attr, attributes[attr]);
              }
            }
          }
        });
      }
    );

    return elm.innerHTML;
  }
}
