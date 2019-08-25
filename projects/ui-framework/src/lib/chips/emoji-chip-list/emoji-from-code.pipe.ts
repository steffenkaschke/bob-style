import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emojiFromCode'
})
export class EmojiFromCodePipe implements PipeTransform {

  transform(value: string, args?: any): any {
    return String.fromCodePoint( Number('0x' + value) );
  }

}
