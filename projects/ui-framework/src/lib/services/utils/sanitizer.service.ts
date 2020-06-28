import { Injectable } from '@angular/core';

import * as xss from 'xss';
import { ICSSFilter, IFilterXSSOptions } from 'xss';
import { isString, chainCall } from './functional-utils';

import {
  RTE_OPTIONS_DEF,
  RTE_ALLOWED_STYLE_PROPS,
} from '../../../../bob-rte/src/rte/rte.const';
import { HtmlParserHelpers } from '../html/html-parser.service';

const SANITIZER_HTML_ALLOWED_ATTRS_TESTS: RegExp[] = RTE_OPTIONS_DEF?.htmlAllowedAttrs?.reduce(
  (testList: RegExp[], attr) => {
    if (attr.includes('*') || attr.includes('^') || attr.includes('.')) {
      testList.push(new RegExp(attr, 'i'));
    }
    return testList;
  },
  []
);

const SANITIZER_FILTER_XSS_OPTIONS: IFilterXSSOptions = {
  whiteList: RTE_OPTIONS_DEF.htmlAllowedTags.reduce((listObj, tag) => {
    listObj[tag] = RTE_OPTIONS_DEF.htmlAllowedAttrs;
    return listObj;
  }, {}),

  css: {
    whiteList: RTE_ALLOWED_STYLE_PROPS.reduce((listObj, prop) => {
      listObj[prop] = true;
      return listObj;
    }, {}),
  },

  stripIgnoreTag: true,
  stripIgnoreTagBody: true,
  allowCommentTag: false,

  onIgnoreTagAttr: (tag, name, value, isWhiteAttr) => {
    if (SANITIZER_HTML_ALLOWED_ATTRS_TESTS.find((test) => test.test(name))) {
      return name + '="' + xss.escapeAttrValue(value) + '"';
    }
  },
};

@Injectable({
  providedIn: 'root',
})
export class SanitizerService {
  constructor(private htmlParser: HtmlParserHelpers) {}

  private htmlSanitizer: ICSSFilter;

  private htmlSanitizeChain = [
    //
    (value: string) =>
      this.htmlParser.removeElements(
        value,
        'img:not([src]), img[src=""], a:not([href]), a[href=""]'
      ),
    (value: string): string =>
      this.htmlParser.cleanupHtml(value, { removeNbsp: true }),
    (value: string): string =>
      this.htmlParser.linkify(value, 'rel="noopener noreferrer"'),
  ];

  public sanitizeHtml(html: string): string {
    if (!html || !isString(html)) {
      return html;
    }

    return chainCall(
      this.htmlSanitizeChain,
      (
        this.htmlSanitizer ||
        (this.htmlSanitizer = new xss.FilterXSS(SANITIZER_FILTER_XSS_OPTIONS))
      ).process(html)
    );
  }
}
