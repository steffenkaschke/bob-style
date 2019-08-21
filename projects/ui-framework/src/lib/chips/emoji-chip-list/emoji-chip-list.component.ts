import {Component, Input, OnInit} from '@angular/core';
import {EmojiChip} from './emoji-chip-list.interface';
import {EmojiFromCodePipe} from './emoji-from-code.pipe';

@Component({
  selector: 'b-emoji-chip-list',
  templateUrl: './emoji-chip-list.component.html',
  styleUrls: ['./emoji-chip-list.component.scss']
})
export class EmojiChipListComponent implements OnInit {
  @Input() valueFormatter: Function;
  @Input() chips: EmojiChip[] = [
    '1F45F',
    '1F452',
    '1F3A9',
    '1F393',
    '1F451',
    '1F392',
    '1F45D'
  ].map((emoji) => {
    return {
      emoji: this.emojiFromCodePipe.transform(emoji),
      number: Math.ceil(Math.random() * 50239847293847000)
    };
  });
  constructor(
    private emojiFromCodePipe: EmojiFromCodePipe
  ) { }

  ngOnInit() {
  }

}
