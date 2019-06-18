import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { stringify } from '../utils/functional-utils';
import { allowedDomainsTest, getUrlData } from './url.const';

@Injectable()
export class UrlSanitizer {
  constructor(private sanitizer: DomSanitizer) {}

  checkUrl(url: string): any {
    const urlData = getUrlData(url);

    if (urlData) {
      for (const key of Object.keys(allowedDomainsTest)) {
        if (allowedDomainsTest[key].test(urlData.hostname)) {
          return this.sanitizer.bypassSecurityTrustResourceUrl(urlData.href);
        }
      }
    }

    throw new Error(
      `URL (${url}) is not allowed. Allowed URLs are [${stringify(
        Object.keys(allowedDomainsTest)
      )}]`
    );
  }
}
