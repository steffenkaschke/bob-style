import { Injectable } from '@angular/core';
import { LinkifyPipe } from '../filters/linkify.pipe';

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
        // empty lines in the end
        .replace(
          /(<p([^\n\r\/<>]+)?><br><\/p>|<div([^\n\r\/<>]+)?><br><\/div>)+$/gi,
          ''
        )
        // empty tags
        .replace(/<[^\/>][^>]+>(\s+)?<\/[^>]+>/gi, '')
        // spaces
        .replace(/&nbsp;/gi, ' ')
        .replace(/\s\s+/g, ' ')
    );
  }
}
