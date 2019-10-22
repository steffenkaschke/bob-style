import { Injectable } from '@angular/core';
import { LinkifyPipe } from '../../services/filters/linkify.pipe';

@Injectable()
export class RteService {
  constructor(public linkifyPipe: LinkifyPipe) {}

  linkify(value: string): string {
    return new LinkifyPipe().transform(value);
  }

  cleanupHtml(value: string): string {
    return (
      value
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
    );
  }
}
