import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'linkify', pure: true })
export class LinkifyPipe implements PipeTransform {
  transform(link: string): string {
    return this.linkify(link);
  }

  private linkify(plainText): string {
    let replacedText;
    const replacePatternHttpFtp = /(\s|[^'"])((https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    const replacePatternWww = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    const replacePatternEmail = /(([a-zA-Z0-9\-_.])+@[a-zA-Z_]+?(\.[a-zA-Z]{2,6})+)/gim;

    replacedText = plainText.replace(
      replacePatternHttpFtp,
      '$1<a href="$2" target="_blank" rel="noopener noreferrer" class="fr-deletable">$2</a>'
    );
    replacedText = replacedText.replace(
      replacePatternWww,
      '$1<a href="http://$2" target="_blank" rel="noopener noreferrer" class="fr-deletable">$2</a>'
    );
    replacedText = replacedText.replace(
      replacePatternEmail,
      '<a href="mailto:$1" rel="noopener noreferrer" class="fr-deletable">$1</a>'
    );

    return replacedText;
  }
}
