import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output
} from '@angular/core';
import {COMMON_EMOJIS, EMOJI_DATA} from './emoji-data.consts';
import {EmojiMap} from './emoji.interface';

@Component({
  selector: 'b-emoji',
  templateUrl: './emoji.component.html',
  styleUrls: ['./emoji.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmojiComponent implements OnInit {
  emojis: EmojiMap;
  commonEmojis: string[];
  emojiMenuState = false;
  @Output() toggleClick = new EventEmitter<boolean>();
  @Output() emojiSelect = new EventEmitter<string>();
  @HostListener('window:click.outside-zone', ['$event']) clickOut(event) {
    this.toggleMenu(false);
  }

  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  stopPropagationClick(e) {
    e.stopPropagation();
  }

  ngOnInit() {
    this.emojis = {...EMOJI_DATA};
    this.commonEmojis = [...COMMON_EMOJIS];
  }

  toggleMenu(forceState?: boolean) {
    this.emojiMenuState = typeof forceState === 'boolean' ? forceState : !this.emojiMenuState;
    this.toggleClick.emit(this.emojiMenuState);
    this.cdr.detectChanges();
  }

  selectEmoji(emoji: string) {
    this.toggleMenu(false);
    setTimeout(() => {
      this.emojiSelect.emit(emoji);
    });
  }
}
