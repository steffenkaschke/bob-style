import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {COMMON_EMOJIS, EMOJI_DATA} from './emoji-data.consts';
import {Emoji} from './emoji.interface';
import {TruncateTooltipType} from '../truncate-tooltip/truncate-tooltip.enum';

@Component({
  selector: 'b-emoji',
  templateUrl: './emoji.component.html',
  styleUrls: ['./emoji.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmojiComponent implements OnInit {
  emojis: { [key: string]: Emoji[] };
  commonEmojis: Emoji[];
  panelActive = false;
  readonly tooltipType = TruncateTooltipType;

  @Input() title: string;
  @Output() toggleClick = new EventEmitter<boolean>();
  @Output() emojiSelect = new EventEmitter<Emoji>();
  @ViewChild('overlayRef', {static: false}) panelElement: any;
  //
  // @HostListener('window:click.outside-zone') clickOut() {
  //   this.toggleMenu(false);
  // }
  constructor(
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.emojis = { ...EMOJI_DATA };
    this.commonEmojis = [...COMMON_EMOJIS];
  }

  toggleMenu(forceState?: boolean) {
    this.panelActive =
      typeof forceState === 'boolean' ? forceState : !this.panelActive;
    if (!this.panelActive && this.panelElement && this.panelElement.overlayRef) {
      this.panelElement.overlayRef.detach();
    }
    this.toggleClick.emit(this.panelActive);
    this.cdr.detectChanges();
  }

  selectEmoji(emoji: Emoji) {
    this.toggleMenu(false);
    setTimeout(() => {
      this.emojiSelect.emit(emoji);
    });
  }
}
